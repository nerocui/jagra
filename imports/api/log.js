import { Meteor } from "meteor/meteor";
import { Logs } from "./db";
import LOGSAPI from "../constant/methods/logsAPI";
import { AuthError, LogError } from "../constant/error";
import { LogMessage } from "../constant/message";

if (Meteor.isServer) {
	Meteor.publish("logs", () => Logs.find());
}

Meteor.methods({
	[LOGSAPI.INSERT](data) {
		if (!this.userId) {
			throw new Meteor.Error(AuthError.NOT_AUTH);
		}
		return Logs.insert({
			data,
		}, (err, log) => {
			if (err) {
				throw new Meteor.Error(LogError.LOG_INSERT_FAIL);
			} else {
				console.log(LogMessage.LOG_CREATED, log);
			}
		});
	},
});
