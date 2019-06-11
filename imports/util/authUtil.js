import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import ROLE from "../constant/role";
import EMPLOYEESAPI from "../constant/methods/employeesAPI";
import ADMIN_INFO from "../config/clientConf/conf";
import { Employees } from "../api/db";

export const isAuthenticated = () => {
	console.log("[Auth Check: ]", Meteor.userId());
	return !!Meteor.userId() || Meteor.isTest;
};

export const isAdmin = (employeeDb, _id) => {
	const user = employeeDb.findOne({ _id });
	console.log("[Chekcing Admin: ]", user);
	return !!((user && user.role === ROLE.ADMIN) || Meteor.isTest);
};

export const login = (email, password, callback) => {
	const accountId = Meteor.loginWithPassword({ email }, password);
	const employee = Employees.findOne({ _id: accountId });
	console.log("[Current User: ]", employee);
	if (employee && employee.role === ROLE.ADMIN) {
		callback();//callback will handle UI redirect
	}
};

export const signup = (email, firstName, lastName) => {
	console.log("[CREATING USER: ]", email);
	Meteor.call(EMPLOYEESAPI.INSERT, Meteor.userId(), email, firstName, lastName, ROLE.EMPLOYEE);
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

export const generateUserName = (firstName, lastName) => {
	let username = firstName + lastName[0];
	let extrachar = 1;
	while (Meteor.users.findOne({ username })) {
		username += extrachar.toString();
		extrachar += 1;
	}
	return username;
};
