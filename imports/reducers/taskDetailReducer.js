/* eslint-disable no-case-declarations */
import * as TYPES from "../actions/types";

export default (state = null, action) => {
	switch (action.type) {
		case TYPES.SET_TASK_DETAIL_ITEM:
			return Object.assign({}, state, { detailItem: action.payload });
		case TYPES.SET_TASK_DETAIL_EDITABLE_ITEM:
			const { editingKey } = state;
			if (!editingKey) {
				return Object.assign({}, state, { editorItem: action.payload });
			}
			const editorItem = action.payload;
			editorItem[editingKey] = state.editorItem[editingKey];
			return Object.assign({}, state, { editorItem });
		case TYPES.SET_EDITING_STATUS_KEY:
			return Object.assign({}, state, { editingKey: action.payload });
		case TYPES.SET_EDITING_KEY_VALUE_PAIR:
			const newEditorItem = state.editorItem;
			newEditorItem[action.payload.key] = action.payload.value;
			return Object.assign({}, state, { editorItem: newEditorItem });
		case TYPES.RESET_EDITOR_STATUS:
			return Object.assign({}, state, { editorItem: state.detailItem, editingKey: null });
		default:
			return state;
	}
};
