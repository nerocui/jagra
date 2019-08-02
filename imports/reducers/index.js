import { combineReducers } from "redux";
import taskDetailView from "./taskDetailReducer";
import commentList from "./commentListReducer";

const rootReducer = combineReducers({
	taskDetailView,
	commentList,
});

export default rootReducer;
