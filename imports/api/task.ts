// @ts-ignore
import { Meteor } from "meteor/meteor";
import { Tasks, Employees, Teams } from "./db";
import Status from "../constant/status";
import moment from 'moment';
import { removeElement, addToList } from '../util/arrayUtil';

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
	"tasks.insert"(title: String, description: String) {
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
		}, (err, task) => {
			if (err) {
				throw new Meteor.Error('Failed to create task');
			}
			// TODO({hiSyl9OaS}): send out email about this update
			// TODO({U-aaiJmDa}): add this to history log in admin data
		});
	},
	"tasks.updateDescription"(_id: String, description: String) {
		if (!this.userId) {
			throw new Meteor.Error("not-authorized");
		}
		let task = Tasks.findOne({_id}).fetch();
		if (!(this.userId === task.creatorId || this.userId === task.assigneeId)) {
			throw new Meteor.Error("no privilege");
		}
		Tasks.update(_id, {description});
		// TODO({yV-k71J7G}): send out email about this update
		// TODO({X_74Ud483}): add this to history log in admin data
	},
	"tasks.updateStatus"(_id: String, status: String) {
		if (!this.userId) {
			throw new Meteor.Error("not-authorized");
		}
		let task = Tasks.findOne({_id}).fetch();
		if (!(this.userId === task.creatorId || this.userId === task.assigneeId)) {
			throw new Meteor.Error("no privilege");
		}
		Tasks.update(_id, {status});
		// TODO({JL8QmmMYU}): send out email about this update
		// TODO({CeBL8z7CB}): add this to history log in admin data
	},
	"tasks.assignTo"(_id: String, employeeId: String, assigneeId: String) {
		if (!this.userId) {
			throw new Meteor.Error("not-authorized");
		}
		let task = Tasks.findOne({_id}).fetch();
		if (!(this.userId === task.creatorId || this.userId === task.assigneeId)) {
			throw new Meteor.Error("no privilege");
		}
		if (this.userId === task.creatorId) {
			const manager = Employees.findOne({employeeId}).fetch(),
				employees = [...manager.employeesId],
				teamId = manager.teamId,
				team = Teams.findOne({employeeId: teamId}).fetch(),
				teamMembers = [...team.members];
			if (employees.includes(assigneeId) || teamMembers.includes(assigneeId)) {
				const currentAssigneeId = task.assignee,
					currentAssignee = Employees.findOne({_id: currentAssigneeId}).fetch(),
					currentAssigneeTodos = currentAssignee.tasksToDo,
					assignee = Employees.findOne({_id: assigneeId}).fetch();
				//remove the task from current assignee's todo list
				Employees.update({_id: currentAssigneeId}, {tasksToDo: removeElement(currentAssigneeTodos, _id)});
				//add the task to the target todo list
				Employees.update({_id}, {tasksToDo: addToList(assignee.tasksToDo, _id)});
				//change the assignee value from task db to the new assignee
				Tasks.update({_id}, {assignee: assigneeId});
			} else {
				
			}
		} else {

		}
		//TODO({22u7JpQt2}): Finish implimentation
	}
});
