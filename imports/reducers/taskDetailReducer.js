/* eslint-disable no-case-declarations */
import * as TYPES from "../actions/types";

export default (state = null, action) => {
	switch (action.type) {
		case TYPES.SET_TASK_DETAIL_ITEM:
			return Object.assign({}, state, { detailItem: action.payload });
		case TYPES.RESET_EDITOR_STATUS:
			return Object.assign({}, state, { editorItem: state.detailItem, editingKey: null });
		default:
			return state;
	}
};
