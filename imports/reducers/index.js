import { combineReducers } from "redux";
import taskDetailItem from "./taskDetailReducer";

const rootReducer = combineReducers({
	taskDetailItem,
});

export default rootReducer;
