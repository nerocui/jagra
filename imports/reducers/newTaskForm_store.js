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
			return Object.assign({}, state, { newTaskTitle: action.payload });
		case NEW_TASK_FORM_ACTION.ON_NEW_TASK_DESCRIPTION_CHANGE:
			return Object.assign({}, state, { newTaskDescription: action.payload });
		case NEW_TASK_FORM_ACTION.ON_NEW_TASK_ASSIGNEEID_CHANGE:
			return Object.assign({}, state, { newTaskAssigneeId: action.payload });
		case NEW_TASK_FORM_ACTION.ON_NEW_TASK_DUEDATE_CHANGE:
			return Object.assign({}, state, { newTaskDueDate: action.payload });
		case NEW_TASK_FORM_ACTION.ON_NEW_TASK_SEARCH_CHANGE:
			return Object.assign({}, state, { searchTerm: action.payload });
		case NEW_TASK_FORM_ACTION.ON_NEW_TASK_SEARCH_BLUR:
			return Object.assign({}, state, { isSearchInFocus: action.payload.isSearchInFocus, searchDataPool: action.payload.searchDataPool });
		case NEW_TASK_FORM_ACTION.ON_NEW_TASK_SEARCH_FOCUS:
			return Object.assign({}, state, { isSearchInFocus: action.payload.isSearchInFocus, searchDataPool: action.payload.searchDataPool });
		case NEW_TASK_FORM_ACTION.ON_NEW_TASK_SEARCH_ITEM_CLICK:
			return Object.assign({}, state, { searchChoices: [...state.searchChoices, action.payload] });
		default:
			return state;
	}
}

export default newTaskForm;
