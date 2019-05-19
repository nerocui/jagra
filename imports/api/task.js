import { Meteor } from "meteor/meteor";
import moment from "moment";
import SimpleSchema from "simpl-schema";
import {
	Tasks,
	Teams,
	Comments,
	Relationships,
	Files,
	Employees,
} from "./db";
import Status from "../constant/status";
import { TaskMessage } from "../constant/message";
import { AuthError, TaskError } from "../constant/error";
import TASKSAPI from "../constant/methods/tasksAPI";
import { isAuthenticated } from "../util/authUtil";
import {
	removeElement,
	addToList,
	removeAllFromList,
} from "../util/arrayUtil";
import { removeTaskFromRelationship } from "./relationship";
import {
	removeCreateTaskFromEmployee,
	removeAssignedTaskFromExployee,
	removeWatchedTaskFromEmployee,
	assignTaskToEmployee,
	watchTaskFromEmployee,
} from "./employee";
import { removeComment } from "./comment";
import { removeTaskReferenceFromFile } from "./file";

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

export const insertTask = (db, userId, title, description) => {
	if (!isAuthenticated()) {
		throw new Meteor.Error(AuthError.NOT_AUTH);
	}
	return db.insert({
		title,
		description,
		status: Status.TO_DO,
		creatorId: userId,
		assigneeId: userId,
		createdAt: moment.now(),
		dueDate: null,
		commentsId: [],
		filesId: [],
		watchersId: [userId],
		relationshipsId: [],
	}, (err, task) => {
		if (err) {
			throw new Meteor.Error(TaskError.TASK_INSERT_FAIL);
		} else {
			console.log(TaskMessage.TASK_CREATED, task);
		}
	});
};

export const removeTask = (db, _id, userId) => {
	if (!isAuthenticated()) {
		throw new Meteor.Error(AuthError.NOT_AUTH);
	}
	const task = db.findOne({ _id });
	if (!task) {
		throw new Meteor.Error(TaskError.TASK_DOES_NOT_EXIST);
	}
	if (userId !== task.creatorId) {
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
	return db.remove({ _id }, err => {
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
				removeTaskFromRelationship(Relationships, r, _id);
				//TODO({qfWxN0X9U}): add a "valid" field. display grey out link if not valid. If both tasks are invalid, delete the relationship.
			});
			removeCreateTaskFromEmployee(Employees, creatorId, _id);
			removeAssignedTaskFromExployee(Employees, assigneeId, _id);
			watchersId.forEach(w => {
				removeWatchedTaskFromEmployee(Employees, w, _id);
			});
			commentsId.forEach(c => {
				removeComment(Comments, c);
			});
			filesId.forEach(f => {
				removeTaskReferenceFromFile(Files, f, _id);
				//TODO({5abJJ8ON4}): do not remove file even the ref is zero, admin need to have a way to recover file.
			});
		}
	});
};

export const updateTaskDescription = (db, _id, userId, description) => {
	if (!isAuthenticated()) {
		throw new Meteor.Error(AuthError.NOT_AUTH);
	}
	const task = db.findOne({ _id });
	if (!task) {
		throw new Meteor.Error(TaskError.TASK_DOES_NOT_EXIST);
	}
	if (!(userId === task.creatorId || userId === task.assigneeId)) {
		throw new Meteor.Error(AuthError.NO_PRIVILEGE);
	}
	return db.update(_id, { description });
};

export const updateTaskStatus = (db, _id, userId, status) => {
	if (!isAuthenticated()) {
		throw new Meteor.Error(AuthError.NOT_AUTH);
	}
	const task = db.findOne({ _id });
	if (!task) {
		throw new Meteor.Error(TaskError.TASK_DOES_NOT_EXIST);
	}
	if (!(userId === task.creatorId || userId === task.assigneeId)) {
		throw new Meteor.Error(AuthError.NO_PRIVILEGE);
	}
	return db.update(_id, { status });
};

export const removeWatcherFromTask = (db, _id, userId, watcherId) => {
	if (!isAuthenticated()) {
		throw new Meteor.Error(Error.NOT_AUTH);
	}
	const task = db.findOne({ _id });
	if (!task) {
		throw new Meteor.Error(TaskError.TASK_DOES_NOT_EXIST);
	}
	//only creator can remove people from watch list
	if (userId === task.creatorId && !(watcherId === task.assigneeId || watcherId === task.creatorId)) {
		let { watchersId } = task;
		watchersId = removeElement(watchersId, watcherId);
		return db.update({ _id }, { watchersId }, err => {
			if (err) {
				throw new Meteor.Error(TaskError.TASK_NOT_WATCHABLE);
			} else {
				removeWatchedTaskFromEmployee(Employees, watcherId, _id);
			}
		});
	}
	throw new Meteor.Error(AuthError.NO_PRIVILEGE);
};

export const watchTask = (db, _id, newWatcherId) => {
	if (!isAuthenticated()) {
		throw new Meteor.Error(Error.NOT_AUTH);
	}
	const task = db.findOne({ _id });
	if (!task) {
		throw new Meteor.Error(TaskError.TASK_DOES_NOT_EXIST);
	}
	let { watchersId } = task;
	watchersId = [...watchersId];
	if (!watchersId.includes(newWatcherId)) {
		watchersId = addToList(watchersId, newWatcherId);
		return db.update({ _id }, { watchersId }, err => {
			if (err) {
				throw new Meteor.Error(TaskError.TASK_NOT_WATCHABLE);
			} else {
				watchTaskFromEmployee(Employees, newWatcherId, _id);
			}
		});
	}
};

export const addWatchersToTask = (db, _id, _watchersId) => _watchersId.map(newWatcherId => watchTask(db, _id, newWatcherId));

export const assignTaskTo = (db, _id, userId, assigneeId) => {
	if (!isAuthenticated()) {
		throw new Meteor.Error(AuthError.NOT_AUTH);
	}
	const task = db.findOne({ _id });
	if (!task) {
		throw new Meteor.Error(TaskError.TASK_DOES_NOT_EXIST);
	}
	//only allowed creator and current assignee to assign task to another employee
	if (!(userId === task.creatorId || userId === task.assigneeId)) {
		throw new Meteor.Error(AuthError.NO_PRIVILEGE);
	}
	//task should be allowed to be assigned to anyone
	const currentAssigneeId = task.assigneeId;
	return db.update({ _id }, { assigneeId }, err => {
		if (err) {
			throw new Meteor.Error(TaskError.TASK_ASSIGN_FAIL);
		} else {
			removeAssignedTaskFromExployee(Employees, currentAssigneeId, _id);
			assignTaskToEmployee(Employees, assigneeId, _id);
			removeWatcherFromTask(db, _id, userId, currentAssigneeId);
			watchTask(Tasks, _id, assigneeId);
		}
	});
};

export const changeTaskDueDate = (db, _id, userId, date) => {
	if (!isAuthenticated()) {
		throw new Meteor.Error(Error.NOT_AUTH);
	}
	const task = db.findOne({ _id });
	if (!task) {
		throw new Meteor.Error(TaskError.TASK_DOES_NOT_EXIST);
	}
	if (!(userId === task.creatorId)) {
		throw new Meteor.Error(Error.NO_PRIVILEGE);
	}
	new SimpleSchema({
		date: {
			type: Date,
		},
	}).validate(date);
	//Check if the date is before current date in front end
	db.update({ _id }, { dueDate: date });
};

export const addCommentToTask = (db, _id, commentId) => {
	if (!isAuthenticated()) {
		throw new Meteor.Error(Error.NOT_AUTH);
	}
	const task = db.findOne({ _id });
	if (!task) {
		throw new Meteor.Error(TaskError.TASK_DOES_NOT_EXIST);
	}
	const { commentsId } = task,
		newCommentsId = addToList(commentsId, commentId);
	return db.update({ _id }, { newCommentsId });
};

export const removeCommentFromTask = (db, _id, commentId) => {
	if (!isAuthenticated()) {
		throw new Meteor.Error(Error.NOT_AUTH);
	}
	const task = db.findOne({ _id }),
		comment = Comments.findOne({ commentId });
	if (!task || !comment) {
		throw new Meteor.Error(TaskError.TASK_DOES_NOT_EXIST);
	}
	const { commentsId } = task,
		{ creatorId } = comment;
	if (this.userId !== creatorId) {
		throw new Meteor.Error(Error.NO_PRIVILEGE);
	}
	const newCommentsId = removeElement(commentsId, commentId);
	return db.update({ _id }, { commentsId: newCommentsId }, err => {
		if (err) {
			throw new Meteor.Error(TaskError.TASK_REMOVE_COMMENT_FAIL);
		} else {
			removeComment(Comments, commentId);
		}
	});
};

export const addWatchersToTaskByTeam = (db, _id, teamId, teamsDb) => {
	if (!isAuthenticated()) {
		throw new Meteor.Error(Error.NOT_AUTH);
	}
	const task = db.findOne({ _id });
	if (!task) {
		throw new Meteor.Error(TaskError.TASK_DOES_NOT_EXIST);
	}
	const team = teamsDb.findOne({ _id: teamId }),
		{ membersId } = team;
	return addWatchersToTask(db, _id, membersId);
};

export const unwatchTask = (db, _id, userId) => {
	if (!isAuthenticated()) {
		throw new Meteor.Error(Error.NOT_AUTH);
	}
	const task = db.findOne({ _id });
	if (!task) {
		throw new Meteor.Error(TaskError.TASK_DOES_NOT_EXIST);
	}
	if (!(userId === task.assigneeId || userId === task.creatorId)) {
		let { watchersId } = task;
		watchersId = removeElement(watchersId, userId);
		return db.update({ _id }, { watchersId }, err => {
			if (err) {
				throw new Meteor.Error(TaskError.TASK_NOT_WATCHABLE);
			} else {
				removeWatchedTaskFromEmployee(Employees, userId, _id);
			}
		});
	}
	throw new Meteor.Error(TaskError.TASK_NOT_UNWATCHABLE);
};

export const removeWatchersFromTask = (db, _id, userId, _watchersId) => {
	if (!isAuthenticated()) {
		throw new Meteor.Error(Error.NOT_AUTH);
	}
	const task = db.findOne({ _id }).fetch();
	if (!task) {
		throw new Meteor.Error(TaskError.TASK_DOES_NOT_EXIST);
	}
	if (userId === task.creatorId) {
		//only allow to unwatch is neither creator nor assignee
		let targetRemovalId = removeElement(_watchersId, task.assigneeId);
		targetRemovalId = removeElement(targetRemovalId, task.creatorId);
		let { watchersId } = task;
		watchersId = removeAllFromList(watchersId, targetRemovalId);
		return db.update({ _id }, { watchersId }, err => {
			if (err) {
				throw new Meteor.Error(TaskError.TASK_NOT_WATCHABLE);
			} else {
				targetRemovalId.forEach(w => {
					removeWatchedTaskFromEmployee(Employees, w, _id);
				});
			}
		});
	}
	throw new Meteor.Error(AuthError.NO_PRIVILEGE);
};

export const removeWatchersFromTaskByTeam = (db, _id, userId, teamId) => {
	if (!isAuthenticated()) {
		throw new Meteor.Error(Error.NOT_AUTH);
	}
	const task = db.findOne({ _id });
	if (!task) {
		throw new Meteor.Error(TaskError.TASK_DOES_NOT_EXIST);
	}
	const team = Teams.findOne({ _id: teamId }),
		{ membersId } = team;
	return removeWatchersFromTask(db, _id, userId, membersId);
};

Meteor.methods({
	[TASKSAPI.INSERT](title, description) {
		return insertTask(Tasks, this.userId, title, description);
	},
	[TASKSAPI.REMOVE](_id) {
		return removeTask(Tasks, _id, this.userId);
	},
	[TASKSAPI.UPDATE_DESCRIPTION](_id, description) {
		return updateTaskDescription(Tasks, _id, this.userId, description);
	},
	[TASKSAPI.UPDATE_STATUS](_id, status) {
		return updateTaskStatus(Tasks, _id, this.userId, status);
	},
	[TASKSAPI.ASSIGN_TO](_id, assigneeId) {
		return assignTaskTo(Tasks, _id, this.userId, assigneeId);
	},
	[TASKSAPI.CHANGE_DUE_DATE](_id, date) {
		return changeTaskDueDate(Tasks, _id, this.userId, date);
	},
	//entry point: comments.insert()
	[TASKSAPI.ADD_COMMENT](_id, commentId) {
		return addCommentToTask(Tasks, _id, commentId);
	},
	[TASKSAPI.REMOVE_COMMENT](_id, commentId) {
		return removeCommentFromTask(Tasks, _id, commentId);
	},
	[TASKSAPI.WATCH](_id) {
		return watchTask(Tasks, _id, this.userId);
	},
	[TASKSAPI.ADD_WATCHER](_id, watcherId) {
		return watchTask(Tasks, _id, watcherId);
	},
	[TASKSAPI.ADD_WATCHERS](_id, _watchersId) {
		return addWatchersToTask(Tasks, _id, _watchersId);
	},
	[TASKSAPI.ADD_WATCHERS_BY_TEAM](_id, teamId) {
		return addWatchersToTaskByTeam(Tasks, _id, teamId, Teams);
	},
	[TASKSAPI.UNWATCH](_id) {
		return unwatchTask(Tasks, _id, this.userId);
	},
	[TASKSAPI.REMOVE_WATCHER](_id, watcherId) {
		return removeWatcherFromTask(Tasks, _id, this.userId, watcherId);
	},
	[TASKSAPI.REMOVE_WATCHERS](_id, _watchersId) {
		return removeWatchersFromTask(Tasks, _id, this.userId, _watchersId);
	},
	[TASKSAPI.REMOVE_WATCHERS_BY_TEAM](_id, teamId) {
		return removeWatchersFromTaskByTeam(Tasks, _id, this.userId, teamId);
	},
});
