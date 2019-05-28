import { Meteor } from "meteor/meteor";
import ROLE from "../constant/role";

export const isAuthenticated = () => Meteor.userId || Meteor.isTest;

export const isAdmin = employeeDb => {
	const user = employeeDb.findOne({ _id: Meteor.userId });
	return user.role === ROLE.ADMIN || Meteor.isTest;
};
