import { Meteor } from "meteor/meteor";
import moment from "moment";
import SimpleSchema from "simpl-schema";
import { Tasks, Teams } from "./db";
import Status from "../constant/status";
import { TaskMessage } from "../constant/message";
import { AuthError, TaskError } from "../constant/error";
import {
	removeElement,
	addToList,
	addAllToList,
	removeAllFromList,
} from "../util/arrayUtil";

if (Meteor.isServer) {
	Meteor.publish("tasks-assigned-to-me", () => Tasks.find({ assigneeId: this.userId }));
	//publish all tasks in my team
	//publish all tasks created by me
	//publish all tasks I watch
	//TODO({l271rUsH-}): need a discussion on how much task a individual can see. All tasks? A subset?
}

// private filesId: Array<String>;
// private relationshipsId: Array<String>;
//TODO({nkWzRdX91}): file and relationship are left not implemented since we don't know how they work

Meteor.methods({
	"tasks.insert"(title, description) {
		if (!this.userId) {
			throw new Meteor.Error(AuthError.NOT_AUTH);
		}
		return Tasks.insert({
			title,
			description,
			status: Status.TO_DO,
			creatorId: this.userId,
			assigneeId: this.userId,
			createdAt: moment.now(),
			dueDate: null,
			commentsId: [],
			filesId: [],
			watchersId: [this.userId],
			relationshipsId: [],
		}, (err, task) => {
			if (err) {
				throw new Meteor.Error(TaskError.TASK_INSERT_FAIL);
			} else {
				console.log(TaskMessage.TASK_CREATED, task);
			}
		});
	},
	"tasks.remove"(_id) {
		if (!this.userId) {
			throw new Meteor.Error(AuthError.NOT_AUTH);
		}
		const task = Tasks.findOne({ _id }).fetch();
		if (!task) {
			throw new Meteor.Error(TaskError.TASK_DOES_NOT_EXIST);
		}
		if (this.userId !== task.creatorId) {
			throw new Meteor.Error(AuthError.NO_PRIVILEGE);
		}
		const {
			relationshipsId, //[]
			creatorId,
			assigneeId,
			watchersId, //[]
			commentsId, //[]
			filesId, //[]
		} = task;
		return Tasks.remove({ _id }, err => {
			if (err) {
				throw new Meteor.Error(TaskError.TASK_INSERT_FAIL);
			} else {
				//only remove reference to all fields if removed task successfully
				//remove reference from files
				//remove comments
				//remove reference from employee(creator, assignee and watchers)
				//strategy for relationships
				//remove reference from team
				relationshipsId.ForEach(r => {
					Meteor.call("relationships.removeTask", r, _id);
					//TODO({qfWxN0X9U}): add a "valid" field. display grey out link if not valid. If both tasks are invalid, delete the relationship.
				});
				Meteor.call("employees.removeTaskFromCreator", creatorId, _id);
				Meteor.call("employees.removeTaskFromAssignee", assigneeId, _id);
				watchersId.ForEach(w => {
					Meteor.call("employees.removeTaskFromWatcher", w, _id);
				});
				commentsId.ForEach(c => {
					Meteor.call("comments.remove", c);
				});
				filesId.ForEach(f => {
					Meteor.call("files.removeRef", f, _id);
					//TODO({5abJJ8ON4}): do not remove file even the ref is zero, admin need to have a way to recover file.
				});
			}
		});
	},
	"tasks.updateDescription"(_id, description) {
		if (!this.userId) {
			throw new Meteor.Error(AuthError.NOT_AUTH);
		}
		const task = Tasks.findOne({ _id }).fetch();
		if (!task) {
			throw new Meteor.Error(TaskError.TASK_DOES_NOT_EXIST);
		}
		if (!(this.userId === task.creatorId || this.userId === task.assigneeId)) {
			throw new Meteor.Error(AuthError.NO_PRIVILEGE);
		}
		return Tasks.update(_id, { description });
	},
	"tasks.updateStatus"(_id, status) {
		if (!this.userId) {
			throw new Meteor.Error(AuthError.NOT_AUTH);
		}
		const task = Tasks.findOne({ _id }).fetch();
		if (!task) {
			throw new Meteor.Error(TaskError.TASK_DOES_NOT_EXIST);
		}
		if (!(this.userId === task.creatorId || this.userId === task.assigneeId)) {
			throw new Meteor.Error(AuthError.NO_PRIVILEGE);
		}
		return Tasks.update(_id, { status });
	},
	"tasks.assignTo"(_id, assigneeId) {
		if (!this.userId) {
			throw new Meteor.Error(AuthError.NOT_AUTH);
		}
		const task = Tasks.findOne({ _id }).fetch();
		if (!task) {
			throw new Meteor.Error(TaskError.TASK_DOES_NOT_EXIST);
		}
		//only allowed creator and current assignee to assign task to another employee
		if (!(this.userId === task.creatorId || this.userId === task.assigneeId)) {
			throw new Meteor.Error(AuthError.NO_PRIVILEGE);
		}
		//task should be allowed to be assigned to anyone
		const currentAssigneeId = task.assigneeId;
		return Tasks.update({ _id }, { assigneeId }, err => {
			if (err) {
				throw new Meteor.Error(TaskError.TASK_ASSIGN_FAIL);
			} else {
				Meteor.call("employees.removeAssignedTask", currentAssigneeId, _id);
				Meteor.call("employees.assignNewTask", assigneeId, _id);
				Meteor.call("tasks.removeWatcher", _id, currentAssigneeId);
				Meteor.call("tasks.addWatcher", _id, assigneeId);
			}
		});
	},
	"tasks.changeDueDate"(_id, date) {
		if (!this.userId) {
			throw new Meteor.Error(Error.NOT_AUTH);
		}
		const task = Tasks.findOne({ _id }).fetch();
		if (!task) {
			throw new Meteor.Error(TaskError.TASK_DOES_NOT_EXIST);
		}
		if (!(this.userId === task.creatorId)) {
			throw new Meteor.Error(Error.NO_PRIVILEGE);
		}
		new SimpleSchema({
			date: {
				type: Date,
			},
		}).validate(date);
		//Check if the date is before current date in front end
		Tasks.update({ _id }, { dueDate: date });
	},
	"tasks.addComment"(_id, comment) {
		if (!this.userId) {
			throw new Meteor.Error(Error.NOT_AUTH);
		}
		const task = Tasks.findOne({ _id }).fetch();
		if (!task) {
			throw new Meteor.Error(TaskError.TASK_DOES_NOT_EXIST);
		}
		const { commentId } = Meteor.call("comments.insert", _id, comment),
			{ commentsId } = task,
			newCommentsId = addToList(commentsId, commentId);
		return Tasks.update({ _id }, { newCommentsId });
	},
	"tasks.removeComment"(_id, commentId) {
		if (!this.userId) {
			throw new Meteor.Error(Error.NOT_AUTH);
		}
		const task = Tasks.findOne({ _id }).fetch();
		if (!task) {
			throw new Meteor.Error(TaskError.TASK_DOES_NOT_EXIST);
		}
		const { commentsId } = task;
		if (this.userId !== task.creatorId) {
			throw new Meteor.Error(Error.NO_PRIVILEGE);
		}
		const newCommentsId = removeElement(commentsId, commentId);
		return Tasks.update({ _id }, { commentsId: newCommentsId }, err => {
			if (err) {
				throw new Meteor.Error(TaskError.TASK_REMOVE_COMMENT_FAIL);
			} else {
				Meteor.call("comments.remove", commentId);
			}
		});
	},
	"tasks.watch"(_id) {
		if (!this.userId) {
			throw new Meteor.Error(Error.NOT_AUTH);
		}
		const task = Tasks.findOne({ _id }).fetch();
		if (!task) {
			throw new Meteor.Error(TaskError.TASK_DOES_NOT_EXIST);
		}
		let { watchersId } = task;
		watchersId = [...watchersId];
		if (!watchersId.includes(this.userId)) {
			watchersId = addToList(watchersId, this.userId);
			return Tasks.update({ _id }, { watchersId }, err => {
				if (err) {
					throw new Meteor.Error(TaskError.TASK_NOT_WATCHABLE);
				} else {
					Meteor.call("employees.watchTask", this.userId, _id);
				}
			});
		}
	},
	"tasks.addWatcher"(_id, watcherId) {
		if (!this.userId) {
			throw new Meteor.Error(Error.NOT_AUTH);
		}
		const task = Tasks.findOne({ _id }).fetch();
		if (!task) {
			throw new Meteor.Error(TaskError.TASK_DOES_NOT_EXIST);
		}
		if (watcherId === this.userId) {
			return Meteor.call("tasks.watch", _id);
		}
		let { watchersId } = task;
		watchersId = [...watchersId];
		if (!watchersId.includes(watcherId)) {
			watchersId = addToList(watchersId, watcherId);
			return Tasks.update({ _id }, { watchersId }, err => {
				if (err) {
					throw new Meteor.Error(TaskError.TASK_NOT_WATCHABLE);
				} else {
					Meteor.call("employees.watchTask", watcherId, _id);
				}
			});
		}
	},
	"tasks.addWatchers"(_id, _watchersId) {
		if (!this.userId) {
			throw new Meteor.Error(Error.NOT_AUTH);
		}
		const task = Tasks.findOne({ _id }).fetch();
		if (!task) {
			throw new Meteor.Error(TaskError.TASK_DOES_NOT_EXIST);
		}
		const watchersId = addAllToList(task.watchersId, _watchersId);
		return Tasks.update({ _id }, { watchersId }, err => {
			if (err) {
				throw new Meteor.Error(TaskError.TASK_NOT_WATCHABLE);
			} else {
				_watchersId.ForEach(w => {
					Meteor.call("employees.watchTask", w, _id);
					//TODO({_H4-ssWr9}): when implementing employees method, only add to watch list if not watching, ignore if already watch
				});
			}
		});
	},
	"tasks.addWatchersByTeam"(_id, teamId) {
		if (!this.userId) {
			throw new Meteor.Error(Error.NOT_AUTH);
		}
		const task = Tasks.findOne({ _id }).fetch();
		if (!task) {
			throw new Meteor.Error(TaskError.TASK_DOES_NOT_EXIST);
		}
		const team = Teams.findOne({ _id: teamId }).fetch(),
			{ membersId } = team;
		return Meteor.call("tasks.addWatchers", _id, membersId);
	},
	"tasks.unwatch"(_id) {
		if (!this.userId) {
			throw new Meteor.Error(Error.NOT_AUTH);
		}
		const task = Tasks.findOne({ _id }).fetch();
		if (!task) {
			throw new Meteor.Error(TaskError.TASK_DOES_NOT_EXIST);
		}
		if (!(this.userId === task.assigneeId || this.userId === task.creatorId)) {
			let { watchersId } = task;
			watchersId = removeElement(watchersId, this.userId);
			return Tasks.update({ _id }, { watchersId }, err => {
				if (err) {
					throw new Meteor.Error(TaskError.TASK_NOT_WATCHABLE);
				} else {
					Meteor.call("employees.unwatchTask", this.userId, _id);
				}
			});
		}
		throw new Meteor.Error(TaskError.TASK_NOT_UNWATCHABLE);
	},
	"tasks.removeWatcher"(_id, watcherId) {
		if (!this.userId) {
			throw new Meteor.Error(Error.NOT_AUTH);
		}
		const task = Tasks.findOne({ _id }).fetch();
		if (!task) {
			throw new Meteor.Error(TaskError.TASK_DOES_NOT_EXIST);
		}
		//only creator can remove people from watch list
		if (this.userId === task.creatorId && !(watcherId === task.assigneeId || watcherId === task.creatorId)) {
			let { watchersId } = task;
			watchersId = removeElement(watchersId, watcherId);
			return Tasks.update({ _id }, { watchersId }, err => {
				if (err) {
					throw new Meteor.Error(TaskError.TASK_NOT_WATCHABLE);
				} else {
					Meteor.call("employees.unwatchTask", watcherId, _id);
				}
			});
		}
		throw new Meteor.Error(AuthError.NO_PRIVILEGE);
	},
	"tasks.removeWatchers"(_id, _watchersId) {
		if (!this.userId) {
			throw new Meteor.Error(Error.NOT_AUTH);
		}
		const task = Tasks.findOne({ _id }).fetch();
		if (!task) {
			throw new Meteor.Error(TaskError.TASK_DOES_NOT_EXIST);
		}
		if (this.userId === task.creatorId) {
			//only allow to unwatch is neither creator nor assignee
			let targetRemovalId = removeElement(_watchersId, task.assigneeId);
			targetRemovalId = removeElement(targetRemovalId, task.creatorId);
			let { watchersId } = task;
			watchersId = removeAllFromList(watchersId, targetRemovalId);
			return Tasks.update({ _id }, { watchersId }, err => {
				if (err) {
					throw new Meteor.Error(TaskError.TASK_NOT_WATCHABLE);
				} else {
					targetRemovalId.ForEach(w => {
						Meteor.call("employees.unwatchTask", w, _id);
					});
				}
			});
		}
		throw new Meteor.Error(AuthError.NO_PRIVILEGE);
	},
	"tasks.removeWatchersByTeam"(_id, teamId) {
		if (!this.userId) {
			throw new Meteor.Error(Error.NOT_AUTH);
		}
		const task = Tasks.findOne({ _id }).fetch();
		if (!task) {
			throw new Meteor.Error(TaskError.TASK_DOES_NOT_EXIST);
		}
		const team = Teams.findOne({ _id: teamId }).fetch(),
			{ membersId } = team;
		return Meteor.call("tasks.removeWatchers", _id, membersId);
	},
});
