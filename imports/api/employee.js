import { Meteor } from "meteor/meteor";
import { Employees } from "./db";
import EMPLOYEESAPI from "../constant/methods/employeesAPI";
import { isAuthenticated } from "../util/authUtil";
import { AuthError, EmployeeError } from "../constant/error";
import { EmployeeMessage } from "../constant/message";
import { removeElement, addToList } from "../util/arrayUtil";
import { isAdmin } from "../util/employeeUtil";

if (Meteor.isServer) {
	Meteor.publish("employees", () => Employees.find());
}

// username, password, accountId, employeeId
export const insertEmployee = (
	db,
	_id,
	employeeId,
	firstName,
	lastName,
	role,
) => {
	if (!isAuthenticated()) {
		throw new Meteor.Error(AuthError.NOT_AUTH);
	}
	if (!isAdmin(_id, Employees)) {
		throw new Meteor.Error(EmployeeError.ADMIN_NOT_FOUND);
	}
	const today = new Date();

	return db.insert(
		{
			employeeId,
			firstName,
			lastName,
			// not sure onBoard should be a today or not
			onBoard: today.getDate(),
			// should manager id and team id be null at the very begining when meteor doing auth
			// or it might come with assigned managerId while inserting employee??
			// I will keep it null for now
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
			// from my understanding, role should be one of"employer", "employee", "admin"?
			// i think it would be better to have it once we create employee, since it make sense to determine the level of the account at the time we create it
			role,
		},
		err => {
			if (err) {
				throw new Meteor.Error(EmployeeError.EMPLOYEE_INSERT_FAIL);
			} else {
				console.log(EmployeeMessage.EMPLOYEE_CREATED);
			}
		},
	);
};

export const removeEmployee = (db, _id, employeeId) => {
	if (!isAuthenticated()) {
		throw new Meteor.Error(AuthError.NOT_AUTH);
	}
	if (!isAdmin(_id, Employees)) {
		throw new Meteor.Error(EmployeeError.ADMIN_NOT_FOUND);
	}
	const employee = Employees.findOne({ employeeId });
	const removedId = employee.employeeId;
	if (!employee) {
		throw new Meteor.Error(EmployeeError.EMPLOYEE_NOT_EXIST);
	}
	if (removedId !== this.employeeId) {
		throw new Meteor.Error(AuthError.NO_PRIVILEGE);
	}

	// TODO:
	// need to make sure tasks status associated with this employee has been updated
	return db.remove(
		{
			employeeId,
		},
		err => {
			if (err) {
				throw new Meteor.Error(EmployeeError.EMPLOYEE_REMOVE_FAIL);
			}
		},
	);
};

export const createTask = (db, _id, taskId) => {
	if (!this.userId) {
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

	return db.update(_id, { tasksCreatedId });
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

export const removeAssignedTaskFromExployee = () => {
	if (!isAuthenticated()) {
		throw new Meteor.Error(AuthError.NOT_AUTH);
	}

	// TODO:
};

export const removeWatchedTaskFromEmployee = () => {
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

export const watchTask = () => {
	if (!isAuthenticated()) {
		throw new Meteor.Error(AuthError.NOT_AUTH);
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
	[EMPLOYEESAPI.INSERT](_id, firstName, lastName, role) {
		return insertEmployee(Employees, _id, firstName, lastName, role);
	},
	// TODO: ADDING parameters to the method mapping below
	[EMPLOYEESAPI.REMOVE](_id) {
		return removeEmployee(Employees, _id);
	},
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
	[EMPLOYEESAPI.WATCH_TASK](_id) {
		return watchTask(Employees, _id);
	},
	[EMPLOYEESAPI.UNWATCH_TASK](_id) {
		return unwatchTask(Employees, _id);
	},
});
