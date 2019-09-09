import React, { Component } from "react";

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
	}

	render() {
		return (
			<div>
				{this.state.err}
				<h1>EmployeeDashboard</h1>
			</div>
		);
	}
}

export default EmployeeDashboard;
