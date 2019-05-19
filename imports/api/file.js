import { Meteor } from "meteor/meteor";
import FILESAPI from "../constant/methods/filesAPI";
import { Files } from "./db";

export const insertFile = (db, file) => {
	console.log("inserting file: ", file);
};

export const removeFile = (db, _id) => {
	console.log("removing file: ", _id);
};

export const removeTaskReferenceFromFile = (db, _id, taskId) => {
	console.log("removing ref of ", taskId, " from ", _id);
};

Meteor.methods({
	[FILESAPI.INSERT](file) {
		return insertFile(Files, file);
	},
	[FILESAPI.REMOVE](_id) {
		return removeFile(Files, _id);
	},
	[FILESAPI.REMOVE_REFERENCE](_id, taskId) {
		return removeTaskReferenceFromFile(Files, _id, taskId);
	},
});
