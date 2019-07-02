import { combineReducers } from "redux";
import newTaskFormStore from "./newTaskForm_store";

const rootReducer = combineReducers({
	newTaskForm: newTaskFormStore,
});

export default rootReducer;
