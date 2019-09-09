import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import {
 Stack, TextField, PrimaryButton, DatePicker, DayOfWeek,
} from "office-ui-fabric-react";
import { Employees } from "../../api/db";
import style from "../../constant/style";
import Picker from "../input/picker.jsx";
import { convertToPickerItems } from "../../util/arrayUtil";
import TASKSAPI from "../../constant/methods/tasksAPI";
import DatePickerConfig from "../../config/uiConfig/datePickerConfig";

const minDate = new Date(Date.now());

class TaskCreate extends Component {
	constructor(props) {
		super(props);
		this.state = {
			newTaskTitle: "",
			newTaskDescription: "",
			newTaskAssigneeId: "",
			newTaskDueDate: null,
		};
		this.onNewTaskTitleChange = this.onNewTaskTitleChange.bind(this);
		this.onNewTaskDescriptionChange = this.onNewTaskDescriptionChange.bind(this);
		this.onNewTaskAssigneeIdChange = this.onNewTaskAssigneeIdChange.bind(this);
		this.onNewTaskDueDateChange = this.onNewTaskDueDateChange.bind(this);
		this.onNewTask = this.onNewTask.bind(this);
	}

	onNewTaskTitleChange(e) {
		this.setState({ newTaskTitle: e.target.value });
	}

	onNewTaskDescriptionChange(e) {
		this.setState({ newTaskDescription: e.target.value });
	}

	onNewTaskAssigneeIdChange(newTaskAssigneeId) {
		this.setState({ newTaskAssigneeId });
	}

	onNewTaskDueDateChange(e) {
		this.setState({ newTaskDueDate: e });
	}

	onNewTask(e) {
		e.preventDefault();
		Meteor.call(TASKSAPI.INSERT, this.state.newTaskTitle, this.state.newTaskDescription, this.state.newTaskAssigneeId, this.state.newTaskDueDate);
	}

	render() {
		return (
			<div className="component--task__create-container">
				<form onSubmit={this.onNewTask}>
					<Stack>
						<h2>New Task</h2>
						<TextField
							className={style.input}
							value={this.state.newTaskTitle}
							onChange={this.onNewTaskTitleChange}
							placeholder="Task Title"
						/>
						<TextField
							className={style.input}
							value={this.state.newTaskDescription}
							onChange={this.onNewTaskDescriptionChange}
							placeholder="Task Description"
						/>
						<Picker
							itemLimit={1}
							placeholder="Pick an assignee"
							suggestionsHeaderText="Suggested Employees"
							noResultsFoundText="No Matching Employee Found"
							items={this.props.employeeList}
							addItemSelected={this.onNewTaskAssigneeIdChange}
						/>
						<DatePicker
							className={style.input}
							isRequired={false}
							minDate={minDate}
							strings={DatePickerConfig.DayPickerStrings}
							firstDayOfWeek={DayOfWeek.Sunday}
							placeholder="Please pick a due date"
							ariaLabel="Please pick a due date"
							allowTextInput={false}
							onSelectDate={this.onNewTaskDueDateChange}
							value={this.state.newTaskDueDate}
						/>
						<PrimaryButton type="submit">Create</PrimaryButton>
					</Stack>
				</form>
			</div>
		);
	}
}

const TaskCreateContainer = withTracker(() => {
	const employeeListHandle = Meteor.subscribe("allEmployees");
	const loading = !employeeListHandle.ready();
	const employeeList = convertToPickerItems(Employees.find({}).fetch(), "email", "firstName");
	return {
		loading,
		employeeList,
	};
})(TaskCreate);
  
export default TaskCreateContainer;
