import { Meteor } from "meteor/meteor";
import { Relationships } from "./db";
import RELATIONSHIPSAPI from "../constant/methods/relationshipsAPI";

export const insertRelationship = (db, relationship) => {
	console.log("inserting relationship: ", relationship);
};

export const removeRelationship = (db, _id) => {
	console.log("removing relationship: ", _id);
};

export const removeTaskFromRelationship = (db, _id, taskId) => {
	console.log("removing task ", taskId, " from ", _id);
};

Meteor.methods({
	[RELATIONSHIPSAPI.INSERT](relationship) {
		return insertRelationship(Relationships, relationship);
	},
	[RELATIONSHIPSAPI.REMOVE](_id) {
		return removeRelationship(Relationships, _id);
	},
	[RELATIONSHIPSAPI.REMOVE_TASK](_id, taskId) {
		return removeTaskFromRelationship(Relationships, _id, taskId);
	},
});
