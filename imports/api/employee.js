import { Meteor } from "meteor/meteor";
import { Employees, Tasks } from "./db";
import EMPLOYEESAPI from "../constant/methods/employeesAPI";
import ROLE from "../constant/role";
import { isAuthenticated, getId, isAdmin } from "../util/authUtil";
import { AuthError, EmployeeError, TaskError } from "../constant/error";
import { EmployeeMessage } from "../constant/message";
import { removeElement, addToList } from "../util/arrayUtil";

if (Meteor.isServer) {
	Meteor.publish("employees", () => Employees.find());
}

export const insertEmployee = (
	db,
	accountId,
	firstName,
	lastName,
	role,
) => {
	if (!isAuthenticated()) {
		throw new Meteor.Error(AuthError.NOT_AUTH);
	}
	if (!isAdmin(Employees)) {
		throw new Meteor.Error(EmployeeError.ADMIN_NOT_FOUND);
	}

	return db.insert(
		{
			_id: accountId,
			firstName,
			lastName,
			onBoard: new Date(),
			// keep it null for now
			managerId: null,
			teamId: null,
			tasksAssienedId: [],
			tasksCreatedId: [],
			tasksWatchingId: [],
			requestsSentId: [],
			requestReceivedId: [],
			commentsId: [],
			filesId: [],
			employeesId: [],
			individualsId: [],
			teamsId: [],
			role,
		},
		err => {
			if (err) {
				throw new Meteor.Error(EmployeeError.EMPLOYEE_INSERT_FAIL);
			} else {
				console.log(`${ EmployeeMessage.EMPLOYEE_CREATED } ${ accountId }`);
			}
		},
	);
};


export const removeWatchedTaskFromEmployee = (db, employeeId, taskId) => {
	if (!isAuthenticated()) {
		throw new Meteor.Error(AuthError.NOT_AUTH);
	}
	const employee = db.findOne({ _id: employeeId });
	if (!employee) {
		throw new Meteor.Error(EmployeeError.EMPLOYEE_NOT_EXIST);
	}
	let { tasksWatchingId } = employee;
	if (tasksWatchingId.includes(taskId)) {
		tasksWatchingId = removeElement(tasksWatchingId, taskId);
		return db.update({ _id: employeeId }, { tasksWatchingId }, err => {
			if (err) {
				throw new Meteor.Error(EmployeeError.WATCHED_TASK_NOT_REMOVABLE);
			}
		});
	}
	throw new Meteor.Error(EmployeeError.TASK_NOT_EXISTED);
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
		if (watchersId.includes(watcherId)) {
			watchersId = removeElement(watchersId, watcherId);
			return db.update({ _id }, { watchersId }, err => {
				if (err) {
					throw new Meteor.Error(TaskError.TASK_NOT_WATCHABLE);
				} else {
					removeWatchedTaskFromEmployee(Employees, watcherId, _id);
				}
			});
		}
	}
	throw new Meteor.Error(AuthError.NO_PRIVILEGE);
};

export const removeAssignedTaskFromEmployee = (db, employeeId, taskId) => {
	if (!isAuthenticated()) {
		throw new Meteor.Error(AuthError.NOT_AUTH);
	}
	const employee = db.findOne({ _id: employeeId });
	if (!employee) {
		throw new Meteor.Error(EmployeeError.EMPLOYEE_NOT_EXIST);
	}
	let { tasksAssienedId } = employee;
	if (tasksAssienedId.includes(taskId)) {
		tasksAssienedId = removeElement(tasksAssienedId, taskId);
		return db.update({ _id: employeeId }, { tasksAssienedId }, err => {
			if (err) {
				throw new Meteor.Error(EmployeeError.ASSIGNED_TASK_NOT_REMOVABLE);
			}
		});
	}
	throw new Meteor.Error(EmployeeError.TASK_NOT_EXISTED);
};

export const assignTaskToEmployee = (db, employeeId, taskId) => {
	if (!isAuthenticated()) {
		throw new Meteor.Error(AuthError.NOT_AUTH);
	}

	const employee = db.findOne({ _id: employeeId });
	if (!employee) {
		throw new Meteor.Error(EmployeeError.EMPLOYEE_NOT_EXIST);
	}
	let { tasksAssienedId } = employee;
	if (!tasksAssienedId.includes(taskId)) {
		tasksAssienedId = addToList(tasksAssienedId, taskId);
		return db.update({ _id: employeeId }, { tasksAssienedId }, err => {
			if (err) {
				throw new Meteor.Error(EmployeeError.ASSIGNED_TASK_NOT_ADDABLE);
			}
		});
	}
	throw new Meteor.Error(EmployeeError.TASK_ALREADY_EXISTED);
};

export const watchTaskFromEmployee = (db, employeeId, taskId) => {
	if (!isAuthenticated()) {
		throw new Meteor.Error(AuthError.NOT_AUTH);
	}
	const employee = db.findOne({ _id: employeeId });
	if (!employee) {
		throw new Meteor.Error(EmployeeError.EMPLOYEE_NOT_EXIST);
	}
	let { tasksWatchingId } = employee;
	if (!tasksWatchingId.includes(taskId)) {
		tasksWatchingId = addToList(tasksWatchingId, taskId);
		return db.update({ _id: employeeId }, { tasksWatchingId }, err => {
			if (err) {
				throw new Meteor.Error(EmployeeError.WATCHED_TASK_NOT_ADDABLE);
			}
		});
	}
	throw new Meteor.Error(EmployeeError.TASK_ALREADY_EXISTED);
};

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
			removeAssignedTaskFromEmployee(Employees, currentAssigneeId, _id);
			assignTaskToEmployee(Employees, assigneeId, _id);
			removeWatcherFromTask(db, _id, userId, currentAssigneeId);
			watchTaskFromEmployee(Tasks, _id, assigneeId);
		}
	});
};

export const removeEmployee = (db, employeeId) => {
	if (!isAuthenticated()) {
		throw new Meteor.Error(AuthError.NOT_AUTH);
	}
	if (!isAdmin(Employees)) {
		throw new Meteor.Error(EmployeeError.ADMIN_NOT_FOUND);
	}
	const employee = Employees.findOne({ employeeId });
	const removedId = employee.employeeId;
	const _id = getId(this.userId);

	if (!employee) {
		throw new Meteor.Error(EmployeeError.EMPLOYEE_NOT_EXIST);
	}
	
	//creator cannot remove himself
	if (removedId === _id) {
		throw new Meteor.Error(AuthError.NO_PRIVILEGE);
	}

	return db.remove(
		{
			_id: employeeId,
		},
		err => {
			if (err) {
				throw new Meteor.Error(EmployeeError.EMPLOYEE_REMOVE_FAIL);
			} else {
				let { tasksWatchingId } = employee;
				tasksWatchingId = [...tasksWatchingId];
				if (tasksWatchingId) {
					tasksWatchingId.forEach(taskId => {
						const task = Tasks.findOne({ taskId });
						if (task && task.creatorId) {
							//only the creator of the task can remove watcher
							removeWatcherFromTask(Tasks, taskId, task.creatorId, employeeId);
						}
						//both creator and current assignee can reassign, lets just use employeeId so that we don't worry about the case theres no creator
						assignTaskTo(Tasks, taskId, employeeId, null);
					});
				}
			}
		},
	);
};

export const createTask = (db, accountId, taskId) => {
	if (!isAuthenticated()) {
		throw new Meteor.Error(AuthError.NOT_AUTH);
	}
	const employee = db.findOne({ _id: accountId });
	if (!employee) {
		throw new Meteor.Error(EmployeeError.EMPLOYEE_NOT_EXIST);
	}
	let { tasksCreatedId } = employee;
	if (!tasksCreatedId.includes(taskId)) {
		tasksCreatedId = addToList(tasksCreatedId, taskId);
		return db.update(
			{
				_id: accountId,
			},
			{
				tasksCreatedId,
			},
			err => {
				if (err) {
					throw new Meteor.Error(EmployeeError.TASK_NOT_CREATABLE);
				}
			},
		);
	}
	throw new Meteor.Error(EmployeeError.TASK_ALREADY_EXISTED);
};

export const removeCreatedTaskFromEmployee = (db, employeeId, taskId) => {
	if (!isAuthenticated()) {
		throw new Meteor.Error(AuthError.NOT_AUTH);
	}

	const employee = db.findOne({ _id: employeeId });
	if (!employee) {
		throw new Meteor.Error(EmployeeError.EMPLOYEE_NOT_EXIST);
	}
	let { tasksCreatedId } = employee;
	if (tasksCreatedId.includes(taskId)) {
		tasksCreatedId = removeElement(tasksCreatedId, taskId);
		return db.update({ _id: employeeId }, { tasksCreatedId }, err => {
			if (err) {
				throw new Meteor.Error(EmployeeError.CREATED_TASK_NOT_REMOVABLE);
			}
		});
	}
	throw new Meteor.Error(EmployeeError.TASK_NOT_EXISTED);
};

const _id = getId(this.userId, Employees);
Meteor.methods({
	[EMPLOYEESAPI.INSERT](firstName, lastName) {
		return insertEmployee(Employees, _id, firstName, lastName, ROLE.EMPLOYEE);
	},
	[EMPLOYEESAPI.REMOVE](employeeId) {
		return removeEmployee(Employees, _id, employeeId);
	},
	[EMPLOYEESAPI.REMOVE_CREATED_TASK](employeeId, taskId) {
		return removeCreatedTaskFromEmployee(Employees, employeeId, taskId);
	},
	[EMPLOYEESAPI.REMOVE_ASSIGNED_TASK](employeeId, taskId) {
		return removeAssignedTaskFromEmployee(Employees, employeeId, taskId);
	},
	[EMPLOYEESAPI.REMOVE_WATCHED_TASK](employeeId, taskId) {
		return removeWatchedTaskFromEmployee(Employees, employeeId, taskId);
	},
	[EMPLOYEESAPI.CREATE_TASK](taskId) {
		return createTask(Employees, _id, taskId);
	},
	[EMPLOYEESAPI.ASSIGN_TASK](employeeId, taskId) {
		return assignTaskToEmployee(Employees, employeeId, taskId);
	},
	[EMPLOYEESAPI.WATCH_TASK_FROM_EMPLOYEE](employeeId, taskId) {
		return watchTaskFromEmployee(Employees, employeeId, taskId);
	},
});
