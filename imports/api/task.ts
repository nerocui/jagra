// @ts-ignore
import { Meteor } from "meteor/meteor";
import { Tasks } from "./db.js";
import Status from "../constant/status";
import moment from 'moment';

	// private _id: String;
	// private title: String;
	// private description: String;
	// private status: String;
	// private creatorId: String;
	// private assigneeId: String;
	// private createdAt: number;
	// private dueDate: Date;
	// private commentsId: Array<String>;
	// private filesId: Array<String>;
	// private watchersId: Array<String>;
	// private relationshipsId: Array<String>;
	// private teamId: String;
Meteor.methods({
	'tasks.insert'(title: String, description: String) {
		if (!this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		return Tasks.insert({
			title,
			description,
			status: Status.TO_DO,
			creatorId: this.userId,
			assigneeId: this.userId,
			createdAt: moment.now(),
			dueDate: null,
			commentsId: [],
			filesId: [],
			watchersId: [this.userId],
			relationshipsId: [],
			teamId: [],
		});
	},

});
