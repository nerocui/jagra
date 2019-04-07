import { Meteor } from "meteor/meteor";
import moment from "moment";
import SimpleSchema from "simpl-schema";
import { Tasks, Teams, Comments } from "./db";
import Status from "../constant/status";
import { TaskMessage } from "../constant/message";
import { AuthError, TaskError } from "../constant/error";
import TASKSAPI from "../constant/methods/tasksAPI";
import RELATIONSHIPSAPI from "../constant/methods/relationshipsAPI";
import EMPLOYEESAPI from "../constant/methods/employeesAPI";
import COMMENTSAPI from "../constant/methods/commentsAPI";
import FILESAPI from "../constant/methods/filesAPI";
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
	[TASKSAPI.INSERT](title, description) {
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
	[TASKSAPI.REMOVE](_id) {
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
				throw new Meteor.Error(TaskError.TASK_REMOVE_FAIL);
			} else {
				//only remove reference to all fields if removed task successfully
				//remove reference from files
				//remove comments
				//remove reference from employee(creator, assignee and watchers)
				//strategy for relationships
				//remove reference from team
				relationshipsId.forEach(r => {
					Meteor.call(RELATIONSHIPSAPI.REMOVE_TASK, r, _id);
					//TODO({qfWxN0X9U}): add a "valid" field. display grey out link if not valid. If both tasks are invalid, delete the relationship.
				});
				Meteor.call(EMPLOYEESAPI.REMOVE_CREATED_TASK, creatorId, _id);
				Meteor.call(EMPLOYEESAPI.REMOVE_ASSIGNED_TASK, assigneeId, _id);
				watchersId.forEach(w => {
					Meteor.call(EMPLOYEESAPI.REMOVE_WATCHED_TASK, w, _id);
				});
				commentsId.forEach(c => {
					Meteor.call(COMMENTSAPI.REMOVE, c);
				});
				filesId.forEach(f => {
					Meteor.call(FILESAPI.REMOVE_REFERENCE, f, _id);
					//TODO({5abJJ8ON4}): do not remove file even the ref is zero, admin need to have a way to recover file.
				});
			}
		});
	},
	[TASKSAPI.UPDATE_DESCRIPTION](_id, description) {
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
	[TASKSAPI.UPDATE_STATUS](_id, status) {
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
	[TASKSAPI.ASSIGN_TO](_id, assigneeId) {
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
				Meteor.call(EMPLOYEESAPI.REMOVE_ASSIGNED_TASK, currentAssigneeId, _id);
				Meteor.call(EMPLOYEESAPI.ASSIGN_TASK, assigneeId, _id);
				Meteor.call(TASKSAPI.REMOVE_WATCHER, _id, currentAssigneeId);
				Meteor.call(TASKSAPI.ADD_WATCHER, _id, assigneeId);
			}
		});
	},
	[TASKSAPI.CHANGE_DUE_DATE](_id, date) {
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
	[TASKSAPI.ADD_COMMENT](_id, commentId) {
		if (!this.userId) {
			throw new Meteor.Error(Error.NOT_AUTH);
		}
		const task = Tasks.findOne({ _id }).fetch();
		if (!task) {
			throw new Meteor.Error(TaskError.TASK_DOES_NOT_EXIST);
		}
		const { commentsId } = task,
			newCommentsId = addToList(commentsId, commentId);
		return Tasks.update({ _id }, { newCommentsId });
	},
	[TASKSAPI.REMOVE_COMMENT](_id, commentId) {
		if (!this.userId) {
			throw new Meteor.Error(Error.NOT_AUTH);
		}
		const task = Tasks.findOne({ _id }).fetch(),
			comment = Comments.findOne({ commentId }).fetch();
		if (!task || !comment) {
			throw new Meteor.Error(TaskError.TASK_DOES_NOT_EXIST);
		}
		const { commentsId } = task,
			{ creatorId } = comment;
		if (this.userId !== creatorId) {
			throw new Meteor.Error(Error.NO_PRIVILEGE);
		}
		const newCommentsId = removeElement(commentsId, commentId);
		return Tasks.update({ _id }, { commentsId: newCommentsId }, err => {
			if (err) {
				throw new Meteor.Error(TaskError.TASK_REMOVE_COMMENT_FAIL);
			} else {
				Meteor.call(COMMENTSAPI.REMOVE, commentId);
			}
		});
	},
	[TASKSAPI.WATCH](_id) {
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
					Meteor.call(EMPLOYEESAPI.WATCH_TASK, this.userId, _id);
				}
			});
		}
	},
	[TASKSAPI.ADD_WATCHER](_id, watcherId) {
		if (!this.userId) {
			throw new Meteor.Error(Error.NOT_AUTH);
		}
		const task = Tasks.findOne({ _id }).fetch();
		if (!task) {
			throw new Meteor.Error(TaskError.TASK_DOES_NOT_EXIST);
		}
		if (watcherId === this.userId) {
			return Meteor.call(TASKSAPI.WATCH, _id);
		}
		let { watchersId } = task;
		watchersId = [...watchersId];
		if (!watchersId.includes(watcherId)) {
			watchersId = addToList(watchersId, watcherId);
			return Tasks.update({ _id }, { watchersId }, err => {
				if (err) {
					throw new Meteor.Error(TaskError.TASK_NOT_WATCHABLE);
				} else {
					Meteor.call(EMPLOYEESAPI.WATCH_TASK, watcherId, _id);
				}
			});
		}
	},
	[TASKSAPI.ADD_WATCHERS](_id, _watchersId) {
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
				_watchersId.forEach(w => {
					Meteor.call(EMPLOYEESAPI.WATCH_TASK, w, _id);
					//TODO({_H4-ssWr9}): when implementing employees method, only add to watch list if not watching, ignore if already watch
				});
			}
		});
	},
	[TASKSAPI.ADD_WATCHERS_BY_TEAM](_id, teamId) {
		if (!this.userId) {
			throw new Meteor.Error(Error.NOT_AUTH);
		}
		const task = Tasks.findOne({ _id }).fetch();
		if (!task) {
			throw new Meteor.Error(TaskError.TASK_DOES_NOT_EXIST);
		}
		const team = Teams.findOne({ _id: teamId }).fetch(),
			{ membersId } = team;
		return Meteor.call(TASKSAPI.ADD_WATCHERS, _id, membersId);
	},
	[TASKSAPI.UNWATCH](_id) {
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
					Meteor.call(EMPLOYEESAPI.UNWATCH_TASK, this.userId, _id);
				}
			});
		}
		throw new Meteor.Error(TaskError.TASK_NOT_UNWATCHABLE);
	},
	[TASKSAPI.REMOVE_WATCHER](_id, watcherId) {
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
					Meteor.call(EMPLOYEESAPI.UNWATCH_TASK, watcherId, _id);
				}
			});
		}
		throw new Meteor.Error(AuthError.NO_PRIVILEGE);
	},
	[TASKSAPI.REMOVE_WATCHERS](_id, _watchersId) {
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
					targetRemovalId.forEach(w => {
						Meteor.call(EMPLOYEESAPI.UNWATCH_TASK, w, _id);
					});
				}
			});
		}
		throw new Meteor.Error(AuthError.NO_PRIVILEGE);
	},
	[TASKSAPI.REMOVE_WATCHERS_BY_TEAM](_id, teamId) {
		if (!this.userId) {
			throw new Meteor.Error(Error.NOT_AUTH);
		}
		const task = Tasks.findOne({ _id }).fetch();
		if (!task) {
			throw new Meteor.Error(TaskError.TASK_DOES_NOT_EXIST);
		}
		const team = Teams.findOne({ _id: teamId }).fetch(),
			{ membersId } = team;
		return Meteor.call(TASKSAPI.REMOVE_WATCHERS, _id, membersId);
	},
});
