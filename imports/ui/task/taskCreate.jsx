import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import {
 Stack, TextField, PrimaryButton, DatePicker, DayOfWeek,
} from "office-ui-fabric-react";
import { connect } from "react-redux";
import { Tasks } from "../../api/db";
import style from "../../constant/style";
import SearchField from "../input/searchField.jsx";
import SEARCH_DOMAIN from "../../constant/actions/searchDomain";
import SEARCH_MODE from "../../constant/actions/searchMode";
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
const searchDomain = [SEARCH_DOMAIN.EMPLOYEE];
const searchClickMode = SEARCH_MODE.SELECTION;

class TaskCreate extends Component {
	constructor(props) {
		super(props);
		this.onNewTaskTitleChange = this.onNewTaskTitleChange.bind(this);
		this.onNewTaskDescriptionChange = this.onNewTaskDescriptionChange.bind(this);
		this.onNewTaskAssigneeIdChange = this.onNewTaskAssigneeIdChange.bind(this);
		this.onNewTaskSearchChange = this.onNewTaskSearchChange.bind(this);
		this.onNewTaskSearchFocus = this.onNewTaskSearchFocus.bind(this);
		this.onNewTaskSearchBlur = this.onNewTaskSearchBlur.bind(this);
		this.onNewTaskDueDateChange = this.onNewTaskDueDateChange.bind(this);
		this.onNewTask = this.onNewTask.bind(this);
	}

	componentDidMount() {
		this.allTasksHandle = Meteor.subscribe("allTasks");
	}

	componentWillUnmount() {
		this.allTasksHandle.stop();
	}

	onNewTaskTitleChange(e) {
		this.props.onNewTaskTitleChange(e.target.value);
	}

	onNewTaskDescriptionChange(e) {
		this.props.onNewTaskDescriptionChange(e.target.value);
	}

	onNewTaskAssigneeIdChange(e) {
		this.props.onNewTaskAssigneeIdChange(this.props.newTaskAssigneeId);
	}

	onNewTaskSearchChange(e) {
		this.props.onNewTaskSearchChange(e.target.value);
	}

	onNewTaskSearchFocus() {
		this.props.onNewTaskSearchFocus(true, Tasks.find({}).fetch());
	}

	onNewTaskSearchBlur() {
		this.props.onNewTaskSearchBlur(false);
	}

	onNewTaskDueDateChange(e) {
		this.props.onNewTaskDueDateChange(e);
	}

	onNewTask(e) {
		this.props.onNewTask(e, this.props.newTaskTitle, this.props.newTaskDescription, this.props.newTaskAssigneeId, this.props.newTaskDueDate);
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
						<TextField
							className={style.input}
							value={this.props.newTaskAssigneeId}
							onChange={this.onNewTaskAssigneeIdChange}
							placeholder="This is a temp assigneeId entry"
						/>
						<SearchField
							searchDomain={searchDomain}
							searchTerm={this.props.searchTerm}
							choices={this.props.searchChoices}
							numberOfChoice={1}
							dataPool={this.props.searchDataPool}
							clickMode={searchClickMode}
							size={style.searchBox.normal}
							isInFocus={this.props.isSearchInFocus}
							onSearchChange={this.onNewTaskSearchChange}
							onSearchFocus={this.onNewTaskSearchFocus}
							onSearchBlur={this.onNewTaskSearchBlur}
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
  
export default connect(mapStateToProps, mapDispatchToProps)(TaskCreate);
