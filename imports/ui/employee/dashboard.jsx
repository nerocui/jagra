import React, { Component } from "react";
import TaskCreate from "../task/taskCreate.jsx";

export default class EmployeeDashboard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			newTaskTitle: "",
			newTaskDescription: "",
			newTaskAssigneeId: "",
			newTaskDueDate: null,
			err: "",
		};
		this.onNewTask = this.onNewTask.bind(this);
		this.onNewTaskTitleChange = this.onNewTaskTitleChange.bind(this);
		this.onNewTaskDescriptionChange = this.onNewTaskDescriptionChange.bind(this);
		this.onNewTaskAssigneeIdChange = this.onNewTaskAssigneeIdChange.bind(this);
		this.onNewTaskDueDateChange = this.onNewTaskDueDateChange.bind(this);
	}

	onNewTask() {

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
			</div>
		);
	}
}
