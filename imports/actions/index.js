import * as TYPES from "./types";

export const setTaskDetailItem = item => ({
		type: TYPES.SET_TASK_DETAIL_ITEM,
		payload: item,
});

export const setCommentList = items => ({
	type: TYPES.SET_COMMENT_LIST,
	payload: items,
});
