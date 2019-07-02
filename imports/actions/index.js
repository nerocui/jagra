import { Meteor } from "meteor/meteor";
import TASKSAPI from "../constant/methods/tasksAPI";
import { NEW_TASK_FORM_ACTION } from "./types";

export const onNewTask = (e, newTaskTitle, newTaskDescription, newTaskAssigneeId, newTaskDueDate) => {
	e.preventDefault();
	Meteor.call(TASKSAPI.INSERT, newTaskTitle, newTaskDescription, newTaskAssigneeId, newTaskDueDate);
	return {
		type: NEW_TASK_FORM_ACTION.ON_NEW_TASK_SUBMIT,
	};
};

export const onNewTaskTitleChange = value => ({
		type: NEW_TASK_FORM_ACTION.ON_NEW_TASK_TITLE_CHANGE,
		payload: value,
});

export const onNewTaskDescriptionChange = value => ({
	type: NEW_TASK_FORM_ACTION.ON_NEW_TASK_DESCRIPTION_CHANGE,
	payload: value,
});

export const onNewTaskAssigneeIdChange = value => ({
	type: NEW_TASK_FORM_ACTION.ON_NEW_TASK_ASSIGNEEID_CHANGE,
	payload: value,
});

export const onNewTaskDueDateChange = value => ({
	type: NEW_TASK_FORM_ACTION.ON_NEW_TASK_DUEDATE_CHANGE,
	payload: value,
});

export const onNewTaskSearchChange = value => ({
	type: NEW_TASK_FORM_ACTION.ON_NEW_TASK_SEARCH_CHANGE,
	payload: value,
});

export const onNewTaskSearchBlur = value => ({
	type: NEW_TASK_FORM_ACTION.ON_NEW_TASK_SEARCH_BLUR,
	payload: {
		isSearchInFocus: value,
		searchDataPool: [],
	},
});

export const onNewTaskSearchFocus = (isSearchInFocus, searchDataPool) => ({
	type: NEW_TASK_FORM_ACTION.ON_NEW_TASK_SEARCH_FOCUS,
	payload: {
		isSearchInFocus,
		searchDataPool,
	},
});

export const onNewTaskSearchItemClick = value => ({
	type: NEW_TASK_FORM_ACTION.ON_NEW_TASK_SEARCH_ITEM_CLICK,
	payload: value,
});
