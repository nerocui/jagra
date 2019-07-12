import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import {
 Stack, TextField, PrimaryButton, DatePicker, DayOfWeek,
} from "office-ui-fabric-react";
import { connect } from "react-redux";
import { Employees } from "../../api/db";
import style from "../../constant/style";
import Picker from "../input/picker.jsx";
import * as actions from "../../actions/index";

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

	onNewTaskAssigneeIdChange() {
		this.props.onNewTaskAssigneeIdChange(this.props.newTaskAssigneeId);
	}

	onNewTaskDueDateChange(e) {
		this.setState({ newTaskDueDate: e });
	}

	onNewTask(e) {
		this.props.onNewTask(e, this.state.newTaskTitle, this.state.newTaskDescription, this.state.newTaskAssigneeId, this.state.newTaskDueDate);
	}

	render() {
		return (
			<div className="component--task__create-container">
				<form onSubmit={this.onNewTask}>
					<Stack>
						<TextField
							className={style.input}
							value={this.props.newTaskTitle}
							onChange={this.onNewTaskTitleChange}
							placeholder="Task Title"
						/>
						<TextField
							className={style.input}
							value={this.props.newTaskDescription}
							onChange={this.onNewTaskDescriptionChange}
							placeholder="Task Description"
						/>
						<Picker
							itemLimit={1}
							items={this.props.employeeList}
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
							value={this.props.newTaskDueDate}
						/>
						<PrimaryButton type="submit">Create</PrimaryButton>
					</Stack>
				</form>	
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		newTaskTitle: state.newTaskForm.newTaskTitle,
		newTaskDescription: state.newTaskForm.newTaskDescription,
		newTaskAssigneeId: state.newTaskForm.newTaskAssigneeId,
		newTaskDueDate: state.newTaskForm.searchTerm,
		searchTerm: state.newTaskForm.newTaskDueDate,
		isSearchInFocus: state.newTaskForm.isSearchInFocus,
		searchDataPool: state.newTaskForm.searchDataPool,
		searchChoices: state.newTaskForm.searchChoices,
	};
}

const mapDispatchToProps = dispatch => ({
	onNewTask: (e, newTaskTitle, newTaskDescription, newTaskAssigneeId, newTaskDueDate) => {
		dispatch(actions.onNewTask(e, newTaskTitle, newTaskDescription, newTaskAssigneeId, newTaskDueDate));
	},
	onNewTaskTitleChange: title => {
		dispatch(actions.onNewTaskTitleChange(title));
	},
	onNewTaskDescriptionChange: description => {
		dispatch(actions.onNewTaskDescriptionChange(description));
	},
	onNewTaskAssigneeIdChange: assigneeId => {
		dispatch(actions.onNewTaskAssigneeIdChange(assigneeId));
	},
	onNewTaskDueDateChange: dueDate => {
		dispatch(actions.onNewTaskDueDateChange(dueDate));
	},
	onNewTaskSearchChange: searchTerm => {
		dispatch(actions.onNewTaskSearchChange(searchTerm));
	},
	onNewTaskSearchBlur: isSearchInFocus => {
		dispatch(actions.onNewTaskSearchBlur(isSearchInFocus));
	},
	onNewTaskSearchFocus: (isSearchInFocus, searchDataPool) => {
		dispatch(actions.onNewTaskSearchFocus(isSearchInFocus, searchDataPool));
	},
});

const TaskCreateContainer = withTracker(() => {
	const employeeListHandle = Meteor.subscribe("allEmployees");
	const loading = !employeeListHandle.ready();
	return {
		loading,
		employeeList: Employees.find({}).fetch().map(employee => Object.assign({}, employee, { key: employee.email, name: employee.firstName })),
	};
})(TaskCreate);
  
export default connect(mapStateToProps, mapDispatchToProps)(TaskCreateContainer);
