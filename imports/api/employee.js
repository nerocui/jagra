import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import { Employees, Tasks } from "./db";
import EMPLOYEESAPI from "../constant/methods/employeesAPI";
import ROLE from "../constant/role";
import { isAuthenticated, isAdmin, generateUserName } from "../util/authUtil";
import { AuthError, EmployeeError, TaskError } from "../constant/error";
import { EmployeeMessage } from "../constant/message";
import { removeElement, addToList } from "../util/arrayUtil";

if (Meteor.isServer) {
	Meteor.publish("allEmployees", () => Employees.find());
}

Accounts.onCreateUser((options, user) => {
	console.log("[backend onCreateUser]", options, user);
	const newUser = user;
	const {
		email,
		firstName,
		lastName,
		role,
	} = options;
	newUser.email = email;
	newUser.firstName = firstName;
	newUser.lastName = lastName;
	newUser.role = role;
	newUser.username = generateUserName(firstName, lastName);
	newUser.onBoard = new Date();
	newUser.managerId = null;
	newUser.teamId = null;
	newUser.tasksAssignedId = [];
	newUser.tasksCreatedId = [];
	newUser.tasksWatchingId = [];
	newUser.requestsSentId = [];
	newUser.commentsId = [];
	newUser.filesId = [];
	newUser.employeesId = [];
	newUser.individualsId = [];
	newUser.teamsId = [];
	return newUser;
});

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

export const removeEmployee = (db, _id, employeeId) => {
	if (!isAuthenticated()) {
		throw new Meteor.Error(AuthError.NOT_AUTH);
	}
	if (!isAdmin(Employees)) {
		throw new Meteor.Error(EmployeeError.ADMIN_NOT_FOUND);
	}
	const employee = Employees.findOne({ _id: employeeId });
	if (!employee) {
		throw new Meteor.Error(EmployeeError.EMPLOYEE_NOT_EXIST);
	}
	
	//admin cannot remove himself
	if (employeeId === _id) {
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
						const task = Tasks.findOne({ _id: taskId });
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

Meteor.methods({
	[EMPLOYEESAPI.INSERT](email, firstName, lastName) {
		if (!isAuthenticated()) {
			throw new Meteor.Error(AuthError.NOT_AUTH);
		}
		if (!isAdmin(this.userId)) {
			throw new Meteor.Error(EmployeeError.ADMIN_NOT_FOUND);
		}
		const accountId = Accounts.createUser({
			email,
			firstName,
			lastName,
			role: ROLE.EMPLOYEE,
		});
		Accounts.sendEnrollmentEmail(accountId);
	},
	[EMPLOYEESAPI.REMOVE](employeeId) {
		return removeEmployee(Employees, this.userId, employeeId);
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
		return createTask(Employees, this.userId, taskId);
	},
	[EMPLOYEESAPI.ASSIGN_TASK](employeeId, taskId) {
		return assignTaskToEmployee(Employees, employeeId, taskId);
	},
	[EMPLOYEESAPI.WATCH_TASK_FROM_EMPLOYEE](employeeId, taskId) {
		return watchTaskFromEmployee(Employees, employeeId, taskId);
	},
});
