import {Meteor} from "meteor/meteor";
import {Employees} from "./db";
import EMPLOYEESAPI from "../constant/methods/employeesAPI";
import { AuthError, EmployeeError } from "../constant/error";
import TASKSAPI from "../constant/methods/tasksAPI";
import { EmployeeMessage } from "../constant/message";

if (Meteor.isServer) {
	Meteor.publish("employees", () => Employees.find());
}

Meteor.methods({
	[EMPLOYEESAPI.INSERT](employeeId, employeeFirstName, employeeLastName, employeePosition){
		if (!this.userId) {
			throw new Meteor.Error(AuthError.NOT_AUTH);
		}
		return Employees.insert({
			creatorId: this.userId,
			employeeId,
			employeeFirstName,
			employeeLastName,
			employeePosition,
			assignedTasks: null,
			watchTasks: null,
			createdTasks: null,
		},(err, employeeFirstName, employeeLastName) => {
			if (err) {
				throw new Meteor.Error(EmployeeError.EMPLOYEE_INSERT_FAIL);
			} else {
				console.log(`${EmployeeMessage.EMPLOYEE_CREATED} ${employeeFirstName} ${employeeLastName}`);
			}
		})
	},

	[EMPLOYEESAPI.REMOVE](_id){
		if (!this.userId) {
			throw new Meteor.Error(AuthError.NOT_AUTH);
		}
		const employee = Employees.findOne({ _id }).fetch(),
			{ creatorId } = employee;
		if (!employee) {
			throw new Meteor.Error(EmployeeError.EMPLOYEE_NOT_EXIST);
		}
		if (creatorId !== this.userId) {
			throw new Meteor.Error(AuthError.NO_PRIVILEGE);
		}

		//TODO:
		//need to add update tasks status associated with this employee
		//including task he created/ assigned/ watched
		//should use TASKSAPI.UPDATE_STATUS/ TASKSAPI.UNWATCH/ TASKSAPI.REMOVE_WATCHER/ 

		return Employees.remove({ _id }, err => {
			if (err) {
				throw new Meteor.Error(EmployeeError.EMPLOYEE_REMOVE_FAIL);
			}
		});
	},

	[EMPLOYEESAPI.CREATE_TASK](employeeId, taskId, taskTitle, taskDescription){
		if (!this.userId) {
			throw new Meteor.Error(AuthError.NOT_AUTH);
		}

		//why dont need taskid while inserting task?
		TASKSAPI.INSERT(taskTitle, taskDescription);
	},

	[EMPLOYEESAPI.REMOVE_CREATED_TASK](employeeId, taskId){
		if (!this.userId) {
			throw new Meteor.Error(AuthError.NOT_AUTH);
		}

		//TODO:
		//This need to be modified
		//need to wrapped in `return`
		TASKSAPI.REMOVE(taskId);

	},

	[EMPLOYEESAPI.REMOVE_ASSIGNED_TASK](employeeId, taskId){
		if (!this.userId) {
			throw new Meteor.Error(AuthError.NOT_AUTH);
		}

		//TODO:
		//This need to be modified
		//need to wrapped in `return`
		TASKSAPI.REMOVE(taskId);

	},

	[EMPLOYEESAPI.REMOVE_WATCHED_TASK](employeeId, taskId){
		if (!this.userId) {
			throw new Meteor.Error(AuthError.NOT_AUTH);
		}

		//TODO:
		//This need to be modified
		//need to wrapped in `return`
		TASKSAPI.REMOVE(taskId);

	},

	[EMPLOYEESAPI.ASSIGN_TASK](employeeId, taskId){
		if (!this.userId) {
			throw new Meteor.Error(AuthError.NOT_AUTH);
		}

		//TODO:
		//This need to be modified
		//need to wrapped in `return`
		TASKSAPI.ASSIGN_TO(taskId, employeeId);
	},

	[EMPLOYEESAPI.WATCH_TASK](employeeId, taskId){
		if (!this.userId) {
			throw new Meteor.Error(AuthError.NOT_AUTH);
		}

		//TODO:
		//This need to be modified
		//need to wrapped in `return`
		TASKSAPI.WATCH(taskId);
		TASKSAPI.ADD_WATCHER(employeeId);
	},

	[EMPLOYEESAPI.UNWATCH_TASK](employeeId, taskId){
		if (!this.userId) {
			throw new Meteor.Error(AuthError.NOT_AUTH);
		}

		//TODO:
		//This need to be modified
		//need to wrapped in `return`
		TASKSAPI.UNWATCH(taskId);
		TASKSAPI.REMOVE_WATCHER(taskId, employeeId);

	},
})