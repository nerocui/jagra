import { combineReducers } from "redux";
import taskDetailView from "./taskDetailReducer";

const rootReducer = combineReducers({
	taskDetailView,
});

export default rootReducer;
