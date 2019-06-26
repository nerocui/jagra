import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import TaskCreate from "../task/taskCreate.jsx";
import TaskList from "../task/taskList.jsx";
import { Tasks } from "../../api/db";
import TASKSAPI from "../../constant/methods/tasksAPI";

const defaultState = {
	newTaskTitle: "",
	newTaskDescription: "",
	newTaskAssigneeId: "",
	newTaskDueDate: null,
	err: "",
};

class EmployeeDashboard extends Component {
	constructor(props) {
		super(props);
		this.state = defaultState;
		this.onNewTask = this.onNewTask.bind(this);
		this.onNewTaskTitleChange = this.onNewTaskTitleChange.bind(this);
		this.onNewTaskDescriptionChange = this.onNewTaskDescriptionChange.bind(this);
		this.onNewTaskAssigneeIdChange = this.onNewTaskAssigneeIdChange.bind(this);
		this.onNewTaskDueDateChange = this.onNewTaskDueDateChange.bind(this);
	}

	onNewTask(e) {
		e.preventDefault();
		Meteor.call(TASKSAPI.INSERT, this.state.newTaskTitle, this.state.newTaskDescription);
		this.resetState();
	}

	onNewTaskTitleChange(e) {
		this.setState({ newTaskTitle: e.target.value });
	}

	onNewTaskDescriptionChange(e) {
		this.setState({ newTaskDescription: e.target.value });
	}

	onNewTaskAssigneeIdChange(e) {
		this.setState({ newTaskAssigneeId: e.target.value });
	}

	onNewTaskDueDateChange(newTaskDueDate) {
		this.setState({ newTaskDueDate });
	}

	resetState() {
		this.setState(defaultState);
	}

	render() {
		return (
			<div>
				{this.state.err}
				<h1>EmployeeDashboard</h1>
				<TaskCreate
					onSubmit={this.onNewTask}
					onTitleChange={this.onNewTaskTitleChange}
					onDescriptionChange={this.onNewTaskDescriptionChange}
					onAssigneeIdChange={this.onNewTaskAssigneeIdChange}
					onDueDateChange={this.onNewTaskDueDateChange}
					titleValue={this.state.newTaskTitle}
					descriptionValue={this.state.newTaskDescription}
					assigneeIdValue={this.state.newTaskAssigneeId}
					dueDateValue={this.state.newTaskDueDate}
				/>
				<TaskList items={this.props.myTaskList || []} />
			</div>
		);
	}
}

const EmployeeDashboardContainer = withTracker(() => {
	const myTaskListHandle = Meteor.subscribe("myTasks");
	const loading = !myTaskListHandle.ready();
	return {
		loading,
		myTaskList: Tasks.find({}).fetch(),
	};
})(EmployeeDashboard);

export default EmployeeDashboardContainer;
