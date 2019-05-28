import { Meteor } from "meteor/meteor";
import { Employees } from "./db";
import EMPLOYEESAPI from "../constant/methods/employeesAPI";

export const insertEmployee = (db, employee) => {
	//admin only action, check auth status
	console.log("inserting employee: ", employee);
};

export const removeEmployee = (db, _id) => {
	//admin only action, check auth status
	console.log("removing employee: ", _id);
};

export const removeCreateTaskFromEmployee = (db, _id, taskId) => {
	console.log("removing created task: ", taskId, " from employee ", _id);
};

export const removeAssignedTaskFromExployee = (db, _id, taskId) => {
	console.log("removing assigned task: ", taskId, " from employee ", _id);
};

export const removeWatchedTaskFromEmployee = (db, _id, taskId) => {
	console.log("removing watched task: ", taskId, " from employee ", _id);
};

export const assignTaskToEmployee = (db, _id, taskId) => {
	console.log("assigning task: ", taskId, " to employee ", _id);
};

export const watchTaskFromEmployee = (db, _id, taskId) => {
	console.log("watching task: ", taskId, " to employee ", _id);
};

Meteor.methods({
	[EMPLOYEESAPI.INSERT](employee) {
		return insertEmployee(Employees, employee);
	},
	[EMPLOYEESAPI.REMOVE](_id) {
		return removeEmployee(Employees, _id);
	},
	[EMPLOYEESAPI.REMOVE_CREATED_TASK](taskId) {
		return removeCreateTaskFromEmployee(Employees, this.userId, taskId);
	},
	[EMPLOYEESAPI.REMOVE_ASSIGNED_TASK](taskId) {
		return removeAssignedTaskFromExployee(Employees, this.userId, taskId);
	},
	[EMPLOYEESAPI.REMOVE_WATCHED_TASK](_id, taskId) {
		return removeWatchedTaskFromEmployee(Employees, _id, taskId);
	},
	[EMPLOYEESAPI.ASSIGN_TASK](_id, taskId) {
		return assignTaskToEmployee(Employees, _id, taskId);
	},
	[EMPLOYEESAPI.WATCH_TASK](_id, taskId) {
		return watchTaskFromEmployee(Employees, _id, taskId);
	},
	[EMPLOYEESAPI.UNWATCH_TASK](taskId) {
		return removeWatchedTaskFromEmployee(Employees, this.userId, taskId);
	},
});
