import {Meteor} from "meteor/meteor";
import {Employees} from "./db";
import EMPLOYEESAPI from "../constant/methods/employeesAPI";
import {AuthError, EmployeeError} from "../constant/error";
import TASKSAPI from "../constant/methods/tasksAPI";
import {EmployeeMessage} from "../constant/message";

if (Meteor.isServer) {
    Meteor.publish("employees", () => Employees.find());
}

// username, password, accountId, employeeId
export const insertEmployee = (db, employeeId, firstName, lastName, role) => {
    if (!this.userId) {
        throw new Meteor.Error(AuthError.NOT_AUTH);
    }
    return db.insert({
        creatorId: this.userId, employeeId, firstName, lastName,
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
        role
    }, (err, firstName, lastName) => {
        if (err) {
            throw new Meteor.Error(EmployeeError.EMPLOYEE_INSERT_FAIL);
        } else {
            console.log(`${
                EmployeeMessage.EMPLOYEE_CREATED
            } ${firstName} ${lastName}`);
        }
    })
};

export const removeEmployee = (db, _id) => {
    if (!this.userId) {
        throw new Meteor.Error(AuthError.NOT_AUTH);
    }
    const employee = Employees.findOne({_id}).fetch(), {creatorId} = employee;
    if (! employee) {
        throw new Meteor.Error(EmployeeError.EMPLOYEE_NOT_EXIST);
    }
    if (creatorId !== this.userId) {
        throw new Meteor.Error(AuthError.NO_PRIVILEGE);
    }

    // TODO:
    // need to add update tasks status associated with this employee
    // including task he created/ assigned/ watched
    // should use TASKSAPI.UPDATE_STATUS/ TASKSAPI.UNWATCH/ TASKSAPI.REMOVE_WATCHER/

    return Employees.remove({
        _id
    }, err => {
        if (err) {
            throw new Meteor.Error(EmployeeError.EMPLOYEE_REMOVE_FAIL);
        }
    });
};

export const createTask = (db, employeeId, taskId, taskTitle, taskDescription) => {
    if (!this.userId) {
        throw new Meteor.Error(AuthError.NOT_AUTH);
    }

    // why dont need taskid while inserting task?
    TASKSAPI.INSERT(taskTitle, taskDescription);
};

export const removeCreatedTask = (db, employeeId, taskId) => {
    if (!this.userId) {
        throw new Meteor.Error(AuthError.NOT_AUTH);
    }

    // TODO:
    // This need to be modified
    // need to wrapped in `return`
    TASKSAPI.REMOVE(taskId);

};

export const removeAssignedTask = (db, employeeId, taskId) => {
    if (!this.userId) {
        throw new Meteor.Error(AuthError.NOT_AUTH);
    }

    // TODO:
    // This need to be modified
    // need to wrapped in `return`
    TASKSAPI.REMOVE(taskId);

};

export const removeWatchedTask = (db, employeeId, taskId) => {
    if (!this.userId) {
        throw new Meteor.Error(AuthError.NOT_AUTH);
    }

    // TODO:
    // This need to be modified
    // need to wrapped in `return`
    TASKSAPI.REMOVE(taskId);

};

export const assignTask = (db, employeeId, taskId) => {
    if (!this.userId) {
        throw new Meteor.Error(AuthError.NOT_AUTH);
    }

    // TODO:
    // This need to be modified
    // need to wrapped in `return`
    TASKSAPI.ASSIGN_TO(taskId, employeeId);
};

export const watchTask = (db, employeeId, taskId) => {
    if (!this.userId) {
        throw new Meteor.Error(AuthError.NOT_AUTH);
    }

    // TODO:
    // This need to be modified
    // need to wrapped in `return`
    TASKSAPI.WATCH(taskId);
    TASKSAPI.ADD_WATCHER(employeeId);
};

export const unwatchTask = (db, employeeId, taskId) => {
    if (!this.userId) {
        throw new Meteor.Error(AuthError.NOT_AUTH);
    }

    // TODO:
    // This need to be modified
    // need to wrapped in `return`
    TASKSAPI.UNWATCH(taskId);
    TASKSAPI.REMOVE_WATCHER(taskId, employeeId);

};

Meteor.methods({
	[EMPLOYEESAPI.INSERT]() {
		return insertEmployee(Employees,);
	},
	[EMPLOYEESAPI.REMOVE]() {
		return removeEmployee(Employees,);
	},
	[EMPLOYEESAPI.REMOVE_CREATED_TASK]() {
		return removeCreatedTask(Employees, );
	},
	[EMPLOYEESAPI.REMOVE_ASSIGNED_TASK]() {
		return removeAssignedTask(Employees, );
	},
	[EMPLOYEESAPI.REMOVE_WATCHED_TASK]() {
		return removeWatchedTask(Employees,);
	},
	[EMPLOYEESAPI.CREATE_TASK]() {
		return createTask(Employees, );
	},
	[EMPLOYEESAPI.ASSIGN_TASK]() {
		return assignTask(Employees, );
	},
	[EMPLOYEESAPI.WATCH_TASK]() {
		return watchTask(Employees, );
	},
	[EMPLOYEESAPI.UNWATCH_TASK]() {
		return unwatchTask(Employees, );
	},
});