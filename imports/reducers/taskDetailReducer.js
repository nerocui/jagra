import { SET_TASK_DETAIL_ITEM } from "../actions/types";

export default (state = null, action) => {
	switch (action.type) {
		case SET_TASK_DETAIL_ITEM:
			return Object.assign({}, state, action.payload);
		default:
			return state;
	}
};
