import * as TYPES from "./types";

export const setTaskDetailItem = item => ({
		type: TYPES.SET_TASK_DETAIL_ITEM,
		payload: item,
});

export const setTaskDetailEditableItem = item => ({
		type: TYPES.SET_TASK_DETAIL_EDITABLE_ITEM,
		payload: item,
});

export const setEditingStatusKey = key => ({
	type: TYPES.SET_EDITING_STATUS_KEY,
	payload: key,
});

export const setEditingKeyValuePair = data => ({
	type: TYPES.SET_EDITING_KEY_VALUE_PAIR,
	payload: data,
});

export const resetEditorStatus = () => ({
	type: TYPES.RESET_EDITOR_STATUS,
});
