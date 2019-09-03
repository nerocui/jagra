import * as TYPES from "../actions/types";

function buildReplyList(item, comments) {
	if (item.repliedById.length === 0) {
		return item;
	}
	const { _id } = item;
	const replies = comments.filter(
		comment => comment.replyToId === _id,
		).map(
			comment => buildReplyList(comment, comments),
	);
	return Object.assign({}, item, { replies });
}

function buildCommentList(comments) {
	const parentCommentList = comments.filter(comment => !comment.replyToId);
	return parentCommentList.map(item => buildReplyList(item, comments));
}

export default (state = null, action) => {
	let commentList = [],
		payloadComments;
	switch (action.type) {
		case TYPES.SET_COMMENT_LIST:
			payloadComments = action.payload.length ? action.payload : [];
			commentList = buildCommentList(payloadComments);
			return commentList;
		default:
			return state;
	}
};
