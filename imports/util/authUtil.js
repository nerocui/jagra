import { Meteor } from "meteor/meteor";
import ROLE from "../constant/role";
import EMPLOYEESAPI from "../constant/methods/employeesAPI";
import ADMIN_INFO from "../config/client/conf";
import { Employees } from "../api/db";

export const isAuthenticated = () => Meteor.userId || Meteor.isTest;

export const isAdmin = employeeDb => {
	const user = employeeDb.findOne({ _id: Meteor.userId });
	return user.role === ROLE.ADMIN || Meteor.isTest;
};

export const login = (email, password, callback, error) => {
	const accountId = Meteor.loginWithPassword(email, password, err => {
		error(err);
	});
	const employee = Employees.findOne({ accountId });
	if (employee && employee.role === ROLE.ADMIN) {
		callback();//callback will handle UI redirect
	}
};

export const signup = (email, password, firstName, lastName, callback) => {
	const accountId = Meteor.createUser(email, password, err => {
		callback(err);
	});
	Meteor.call(EMPLOYEESAPI.INSERT, accountId, email, firstName, lastName, ROLE.EMPLOYEE);
};

export const adminCheck = db => {
	const admin = db.findOne({ role: ROLE.ADMIN });
	if (!admin) {
		const newAdmin = Meteor.createUser(ADMIN_INFO.ADMIN_EMAIL, ADMIN_INFO.ADMIN_PASSWORD, err => {
			console.log("Fail to create admin", err);
		});
		Meteor.call(EMPLOYEESAPI.INSERT, newAdmin, ADMIN_INFO.ADMIN_EMAIL, "admin", ADMIN_INFO.COMPANY_NAME, ROLE.ADMIN);
	}
};
