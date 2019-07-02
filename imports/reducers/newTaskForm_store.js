import { NEW_TASK_FORM_ACTION } from "../actions/types";

const defaultState = {
	newTaskTitle: "",
	newTaskDescription: "",
	newTaskAssigneeId: "",
	newTaskDueDate: null,
	searchTerm: "",
	isSearchInFocus: false,
	searchDataPool: [],
	searchChoices: [],
	err: "",
};
function newTaskForm(state = defaultState, action) {
	switch (action.type) {
		case NEW_TASK_FORM_ACTION.ON_NEW_TASK_SUBMIT:
			return defaultState;
		case NEW_TASK_FORM_ACTION.ON_NEW_TASK_TITLE_CHANGE:
			return Object.assign(state, {title: action.payload});
		case NEW_TASK_FORM_ACTION.ON_NEW_TASK_DESCRIPTION_CHANGE:
			return Object.assign(state, {description: action.payload});
		case NEW_TASK_FORM_ACTION.ON_NEW_TASK_ASSIGNEEID_CHANGE:
			return Object.assign(state, {assigneeId: action.payload});
		case NEW_TASK_FORM_ACTION.ON_NEW_TASK_DUEDATE_CHANGE:
			return Object.assign(state, {dueDate: action.payload});
		case NEW_TASK_FORM_ACTION.ON_NEW_TASK_SEARCH_CHANGE:
			return Object.assign(state, {searchTerm: action.payload});
		case NEW_TASK_FORM_ACTION.ON_NEW_TASK_SEARCH_BLUR:
			return Object.assign(state, {isSearchInFocus: action.payload.isSearchInFocus, searchDataPool: action.payload.searchDataPool});
		case NEW_TASK_FORM_ACTION.ON_NEW_TASK_SEARCH_FOCUS:
			return Object.assign(state, {isSearchInFocus: action.payload.isSearchInFocus, searchDataPool: action.payload.searchDataPool});
		default:
			return state;
	}
}

export default newTaskForm;
