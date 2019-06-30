import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import {
 Stack, TextField, PrimaryButton, DatePicker, DayOfWeek,
} from "office-ui-fabric-react";
import TASKSAPI from "../../constant/methods/tasksAPI";
import style from "../../constant/style";
import SearchField from "../input/SearchField.jsx";
import SEARCH_DOMAIN from "../../constant/actions/searchDomain";
import SEARCH_MODE from "../../constant/actions/searchMode";

const DayPickerStrings = {
	months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
	shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
	days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
	shortDays: ["S", "M", "T", "W", "T", "F", "S"],
	goToToday: "Go to today",
	prevMonthAriaLabel: "Go to previous month",
	nextMonthAriaLabel: "Go to next month",
	prevYearAriaLabel: "Go to previous year",
	nextYearAriaLabel: "Go to next year",
	closeButtonAriaLabel: "Close date picker",
	isRequiredErrorMessage: "Field is required.",
	invalidInputErrorMessage: "Invalid date format.",
	isOutOfBoundsErrorMessage: "Date must be after today.",
};

const minDate = new Date(Date.now());

const defaultState = {
	newTaskTitle: "",
	newTaskDescription: "",
	newTaskAssigneeId: "",
	newTaskDueDate: null,
	searchTerm: "",
	searchChoices: [],
	err: "",
};

const searchDomain = [SEARCH_DOMAIN.EMPLOYEE];
const searchClickMode = SEARCH_MODE.SELECTION;

class TaskCreate extends Component {
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
		Meteor.call(TASKSAPI.INSERT, this.state.newTaskTitle, this.state.newTaskDescription, this.state.newTaskAssigneeId, this.state.newTaskDueDate);
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
			<div className="component--task__create-container">
				<form onSubmit={this.onNewTask}>
					<Stack>
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
						<TextField
							className={style.input}
							value={this.state.newTaskAssigneeId}
							onChange={this.onNewTaskAssigneeIdChange}
							placeholder="This is a temp assigneeId entry"
						/>
						<SearchField
							searchDomain={searchDomain}
							searchTerm={this.state.searchTerm}
							choices={this.state.searchChoices}
							numberOfChoice={1}
							dataPool={this.props.dataPool || []}
							clickMode={searchClickMode}
							size={style.searchBox.normal}
						/>
						<DatePicker
							className={style.input}
							isRequired={false}
							minDate={minDate}
							strings={DayPickerStrings}
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

export default TaskCreate;
