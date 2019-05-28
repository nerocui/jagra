import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import ROLE from "../constant/role";
import EMPLOYEESAPI from "../constant/methods/employeesAPI";
import ADMIN_INFO from "../config/clientConf/conf";
import { Employees } from "../api/db";

export const isAuthenticated = () => Meteor.user() || Meteor.isTest;

export const isAdmin = employeeDb => {
	const user = employeeDb.findOne({ _id: Meteor.userId });
	return user.role === ROLE.ADMIN || Meteor.isTest;
};

export const login = (email, password, callback) => {
	const accountId = Meteor.loginWithPassword(email, password);
	const employee = Employees.findOne({ accountId });
	if (employee && employee.role === ROLE.ADMIN) {
		callback();//callback will handle UI redirect
	}
};

export const signup = (email, password, firstName, lastName) => {
	const accountId = Accounts.createUser({ email, password });
	Meteor.call(EMPLOYEESAPI.INSERT, accountId, email, firstName, lastName, ROLE.EMPLOYEE);
};

export const adminCheck = db => {
	const admin = db.findOne({ role: ROLE.ADMIN });
	if (!admin) {
		const newAdmin = Accounts.createUser({ email: ADMIN_INFO.ADMIN_EMAIL, password: ADMIN_INFO.ADMIN_PASSWORD });
		Meteor.call(EMPLOYEESAPI.INSERT, newAdmin, ADMIN_INFO.ADMIN_EMAIL, "admin", ADMIN_INFO.COMPANY_NAME, ROLE.ADMIN);
	}
};
