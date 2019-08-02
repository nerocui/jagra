/* eslint-disable no-case-declarations */
import * as TYPES from "../actions/types";

export default (state = null, action) => {
	switch (action.type) {
		case TYPES.SET_TASK_DETAIL_ITEM:
			return Object.assign({}, state, { detailItem: action.payload });
		default:
			return state;
	}
};
