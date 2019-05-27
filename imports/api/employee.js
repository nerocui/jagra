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
        employeeId, firstName, lastName,
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
	//TODO: not too sure use _id or employeeid
    const employee = Employees.findOne({_id}), {creatorId} = employee;
    if (! employee) {
        throw new Meteor.Error(EmployeeError.EMPLOYEE_NOT_EXIST);
    }
    if (creatorId !== this.userId) {
        throw new Meteor.Error(AuthError.NO_PRIVILEGE);
    }

    // TODO:
    // need to make sure tasks status associated with this employee has been updated 
    return db.remove({
        _id
    }, err => {
        if (err) {
            throw new Meteor.Error(EmployeeError.EMPLOYEE_REMOVE_FAIL);
        }
    });
};

//TODO: do we need this in employee???
//I think so, delete this for now :/
// export const createTask = (db, employeeId, taskId, taskTitle, taskDescription) => {
//     if (!this.userId) {
//         throw new Meteor.Error(AuthError.NOT_AUTH);
// 	}
// 	//TODO: not too sure use _id or employeeid
// 	const employee = db.findOne({ employeeId });
// 	if (!employee) {
// 		throw new Meteor.Error(EmployeeError.EMPLOYEE_NOT_EXIST);
// 	}
// 	let { tasksCreatedId } = employee;
// 	tasksCreatedId = [...tasksCreatedId];
// 	if (!tasksCreatedId.includes(taskId)) {
// 		tasksCreatedId = addToList(tasksCreatedId, taskId);
// 		return db.update({ employeeId }, { tasksCreatedId }, err => {
// 			if (err) {
// 				throw new Meteor.Error(EmployeeError.TASK_NOT_CREATABLE);
// 			} else {
// 				//TODO:
// 			}
// 		});
// 	}
    
//     return db.update(_id, {tasksCreatedId })
// };

export const removeCreateTaskFromEmployee = (db, employeeId, taskId) => {
    if (!this.userId) {
        throw new Meteor.Error(AuthError.NOT_AUTH);
    }

    // TODO:


};

export const removeAssignedTaskFromExployee = (db, employeeId, taskId) => {
    if (!this.userId) {
        throw new Meteor.Error(AuthError.NOT_AUTH);
    }

    // TODO:
    

};

export const removeWatchedTaskFromEmployee = (db, employeeId, taskId) => {
    if (!this.userId) {
        throw new Meteor.Error(AuthError.NOT_AUTH);
    }

    // TODO:
    

};

export const assignTaskToEmployee = (db, employeeId, taskId) => {
    if (!this.userId) {
        throw new Meteor.Error(AuthError.NOT_AUTH);
    }

    // TODO:
    
};

export const watchTask = (db, employeeId, taskId) => {
    if (!this.userId) {
        throw new Meteor.Error(AuthError.NOT_AUTH);
    }

    // TODO:
   
};

export const unwatchTask = (db, employeeId, taskId) => {
    if (!this.userId) {
        throw new Meteor.Error(AuthError.NOT_AUTH);
    }

    // TODO:

};

Meteor.methods({
	[EMPLOYEESAPI.INSERT](employeeId, firstName, lastName, role) {
		return insertEmployee(Employees, employeeId, firstName, lastName, role);
	},
	//TODO: ADDING parameters to the method mapping below
	[EMPLOYEESAPI.REMOVE]() {
		return removeEmployee(Employees,);
	},
	[EMPLOYEESAPI.REMOVE_CREATED_TASK]() {
		return removeCreateTaskFromEmployee(Employees, );
	},
	[EMPLOYEESAPI.REMOVE_ASSIGNED_TASK]() {
		return removeAssignedTaskFromExployee(Employees, );
	},
	[EMPLOYEESAPI.REMOVE_WATCHED_TASK]() {
		return removeWatchedTaskFromEmployee(Employees,);
	},
	[EMPLOYEESAPI.CREATE_TASK]() {
		return createTask(Employees, );
	},
	[EMPLOYEESAPI.ASSIGN_TASK]() {
		return assignTaskToEmployee(Employees, );
	},
	[EMPLOYEESAPI.WATCH_TASK]() {
		return watchTask(Employees, );
	},
	[EMPLOYEESAPI.UNWATCH_TASK]() {
		return unwatchTask(Employees, );
	},
});