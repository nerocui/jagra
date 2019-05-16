import { Meteor } from "meteor/meteor";

// eslint-disable-next-line import/prefer-default-export
export const isAuthenticated = () => {
	if (Meteor.isTest) {
		return true;
	}
	return Meteor.userId;
};
