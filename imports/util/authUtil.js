import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import ROLE from "../constant/role";
import EMPLOYEESAPI from "../constant/methods/employeesAPI";
import ADMIN_INFO from "../config/clientConf/conf";
import { Employees } from "../api/db";

export const isAuthenticated = () => {
	console.log("[Auth Check: ]", Meteor.user());
	return !!Meteor.user() || Meteor.isTest;
};

export const isAdmin = employeeDb => {
	const user = employeeDb.findOne({ _id: Meteor.userId });
	return !!((user && user.role === ROLE.ADMIN) || Meteor.isTest);
};

export const login = (email, password, callback) => {
	const accountId = Meteor.loginWithPassword({ email }, password);
	const employee = Employees.findOne({ accountId });
	console.log("[Current User: ]", employee);
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
		console.log("[ADMIN INFO: ]", ADMIN_INFO);
		const newAdmin = Accounts.createUser({ username: "admin", email: ADMIN_INFO.ADMIN_EMAIL, password: "admin" });
		
		return db.insert(
			{
				_id: newAdmin,
				email: ADMIN_INFO.ADMIN_EMAIL,
				firstName: "admin",
				lastName: ADMIN_INFO.COMPANY_NAME,
				onBoard: new Date(),
				role: ROLE.ADMIN,
			},
		);
	}
};
