import { Meteor } from "meteor/meteor";
import moment from "moment";
import { Tasks, Employees, Teams } from "./db";
import Status from "../constant/status";
import { removeElement, addToList } from "../util/arrayUtil";

if (Meteor.isServer) {
	Meteor.publish("tasks-assigned-to-me", () => Tasks.find({ assigneeId: this.userId }));
}

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
	"tasks.insert"(title, description) {
		if (!this.userId) {
			throw new Meteor.Error("not-authorized");
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
				throw new Meteor.Error("Failed to create task");
			} else {
				console.log("Created task: ", task);
			}
		});
	},
	"tasks.updateDescription"(_id, description) {
		if (!this.userId) {
			throw new Meteor.Error("not-authorized");
		}
		const task = Tasks.findOne({ _id }).fetch();
		if (!(this.userId === task.creatorId || this.userId === task.assigneeId)) {
			throw new Meteor.Error("no privilege");
		}
		Tasks.update(_id, { description });
	},
	"tasks.updateStatus"(_id, status) {
		if (!this.userId) {
			throw new Meteor.Error("not-authorized");
		}
		const task = Tasks.findOne({ _id }).fetch();
		if (!(this.userId === task.creatorId || this.userId === task.assigneeId)) {
			throw new Meteor.Error("no privilege");
		}
		Tasks.update(_id, { status });
	},
	"tasks.assignTo"(_id, employeeId, assigneeId) {
		if (!this.userId) {
			throw new Meteor.Error("not-authorized");
		}
		const task = Tasks.findOne({ _id }).fetch();
		if (!(this.userId === task.creatorId || this.userId === task.assigneeId)) {
			throw new Meteor.Error("no privilege");
		}
		const manager = Employees.findOne({ employeeId }).fetch(),
			employees = [...manager.employeesId],
			{ teamId } = manager,
			team = Teams.findOne({ employeeId: teamId }).fetch(),
			teamMembers = [...team.members];
		if (employees.includes(assigneeId) || teamMembers.includes(assigneeId)) {
			const currentAssigneeId = task.assignee,
				currentAssignee = Employees.findOne({ _id: currentAssigneeId }).fetch(),
				currentAssigneeTodos = currentAssignee.tasksToDo,
				assignee = Employees.findOne({ _id: assigneeId }).fetch();
			Employees.update({ _id: currentAssigneeId }, { tasksToDo: removeElement(currentAssigneeTodos, _id) });
			Employees.update({ _id }, { tasksToDo: addToList(assignee.tasksToDo, _id) });
			Tasks.update({ _id }, { assignee: assigneeId });
		}
	},
});
