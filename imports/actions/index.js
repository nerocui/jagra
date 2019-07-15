import { SET_TASK_DETAIL_ITEM } from "./types";

export const setTaskDetailItem = item => {
	return {
		type: SET_TASK_DETAIL_ITEM,
		payload: item,
	};
};
