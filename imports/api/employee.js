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


export const removeWatchedTaskFromEmployee = (db, accountId, taskId) => {
	if (!isAuthenticated()) {
		throw new Meteor.Error(AuthError.NOT_AUTH);
	}
	const employee = db.findOne({ accountId });
	if (!employee) {
		throw new Meteor.Error(EmployeeError.EMPLOYEE_NOT_EXIST);
	}
	let { tasksWatchingId } = employee;
	if (tasksWatchingId.includes(taskId)) {
		tasksWatchingId = removeElement(tasksWatchingId, taskId);
		return db.update({ _id: accountId }, { tasksWatchingId }, err => {
			if (err) {
				throw new Meteor.Error(EmployeeError.WATCHED_TASK_NOT_REMOVABLE);
			}
		});
	}

	// TODO:
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

export const removeAssignedTaskFromExployee = () => {
	if (!isAuthenticated()) {
		throw new Meteor.Error(AuthError.NOT_AUTH);
	}

	// TODO:
};

export const assignTaskToEmployee = () => {
	if (!isAuthenticated()) {
		throw new Meteor.Error(AuthError.NOT_AUTH);
	}

	// TODO:
};

export const watchTaskFromEmployee = () => {
	if (!isAuthenticated()) {
		throw new Meteor.Error(AuthError.NOT_AUTH);
	}

	// TODO:
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
			removeAssignedTaskFromExployee(Employees, currentAssigneeId, _id);
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

export const createTask = (db, _id, taskId) => {
	if (!isAuthenticated()) {
		throw new Meteor.Error(AuthError.NOT_AUTH);
	}
	// TODO: not too sure use _id or employeeid
	const employee = db.findOne({ _id });
	if (!employee) {
		throw new Meteor.Error(EmployeeError.EMPLOYEE_NOT_EXIST);
	}
	let { tasksCreatedId } = employee;
	tasksCreatedId = [...tasksCreatedId];
	if (!tasksCreatedId.includes(taskId)) {
		tasksCreatedId = addToList(tasksCreatedId, taskId);
		return db.update(
			{
				_id,
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
};

export const removeCreateTaskFromEmployee = (db, _id, taskId) => {
	if (!isAuthenticated()) {
		throw new Meteor.Error(AuthError.NOT_AUTH);
	}

	const employee = db.findOne({ _id });
	if (!employee) {
		throw new Meteor.Error(EmployeeError.EMPLOYEE_NOT_EXIST);
	}
	let { tasksCreatedId } = employee;
	tasksCreatedId = [...tasksCreatedId];
	if (tasksCreatedId.includes(taskId)) {
		tasksCreatedId = removeElement(tasksCreatedId, taskId);
		return db.update(
			{
				_id,
			},
			{
				tasksCreatedId,
			},
			err => {
				if (err) {
					throw new Meteor.Error(
						EmployeeError.CREATED_TASK_NOT_REMOVABLE,
					);
				}
			},
		);
	}

	// TODO:
};

export const unwatchTask = () => {
	if (!isAuthenticated()) {
		throw new Meteor.Error(AuthError.NOT_AUTH);
	}

	// TODO:
};

Meteor.methods({
	[EMPLOYEESAPI.INSERT](firstName, lastName) {
		const _id = getId(this.userId, Employees);
		return insertEmployee(Employees, _id, firstName, lastName, ROLE.EMPLOYEE);
	},
	// TODO: ADDING parameters to the method mapping below
	[EMPLOYEESAPI.REMOVE](employeeId) {
		const _id = getId(this.userId, Employees);
		return removeEmployee(Employees, _id, employeeId);
	},
	//FOR this PR, IGNORE BELOW
	[EMPLOYEESAPI.REMOVE_CREATED_TASK](_id) {
		return removeCreateTaskFromEmployee(Employees, _id);
	},
	[EMPLOYEESAPI.REMOVE_ASSIGNED_TASK](_id) {
		return removeAssignedTaskFromExployee(Employees, _id);
	},
	[EMPLOYEESAPI.REMOVE_WATCHED_TASK](_id) {
		return removeWatchedTaskFromEmployee(Employees, _id);
	},
	[EMPLOYEESAPI.CREATE_TASK](_id) {
		return createTask(Employees, _id);
	},
	[EMPLOYEESAPI.ASSIGN_TASK](_id) {
		return assignTaskToEmployee(Employees, _id);
	},
	[EMPLOYEESAPI.WATCH_TASK_FROM_EMPLOYEE](_id) {
		return watchTaskFromEmployee(Employees, _id);
	},
	[EMPLOYEESAPI.UNWATCH_TASK](_id) {
		return unwatchTask(Employees, _id);
	},
});
