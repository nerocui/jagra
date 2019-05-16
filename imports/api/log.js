import { Meteor } from "meteor/meteor";
import { Logs } from "./db";
import LOGSAPI from "../constant/methods/logsAPI";
import { AuthError, LogError } from "../constant/error";
import { LogMessage } from "../constant/message";
import { isAuthenticated } from "../util/authUtil";

if (Meteor.isServer) {
	Meteor.publish("logs", () => Logs.find());
}

export const insertLog = (db, data) => {
	if (!isAuthenticated()) {
		throw new Meteor.Error(AuthError.NOT_AUTH);
	}
	return db.insert({
		data,
	}, (err, log) => {
		if (err) {
			throw new Meteor.Error(LogError.LOG_INSERT_FAIL);
		} else {
			console.log(LogMessage.LOG_CREATED, log);
		}
	});
};

export const removeLog = (db, _id) => {
	if (!isAuthenticated()) {
		throw new Meteor.Error(AuthError.NOT_AUTH);
	}
	return db.remove({ _id }, err => {
		if (err) {
			throw Meteor.Error(LOGSAPI.REMOVE);
		}
	});
};

Meteor.methods({
	[LOGSAPI.INSERT](data) {
		insertLog(Logs, data);
	},
	[LOGSAPI.REMOVE](_id) {
		removeLog(Logs, _id);
	},
});
