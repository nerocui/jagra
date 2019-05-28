import { Meteor } from "meteor/meteor";
import moment from "moment";
import { Comments, Tasks } from "./db";
import { AuthError, CommentError, TaskError } from "../constant/error";
import COMMENTSAPI from "../constant/methods/commentsAPI";
import { CommentMessage } from "../constant/message";
import { addToList, removeElement } from "../util/arrayUtil";
import { isAuthenticated } from "../util/authUtil";

if (Meteor.isServer) {
	Meteor.publish("comments", () => Comments.find());
}

export const addCommentToTask = (db, _id, commentId) => {
	if (!isAuthenticated()) {
		throw new Meteor.Error(Error.NOT_AUTH);
	}
	const task = db.findOne({ _id });
	if (!task) {
		throw new Meteor.Error(TaskError.TASK_DOES_NOT_EXIST);
	}
	const { commentsId } = task,
		newCommentsId = addToList(commentsId, commentId);
	return db.update({ _id }, { newCommentsId });
};

export const insertComment = (db, userId, taskId, content) => {
	if (!isAuthenticated()) {
		throw new Meteor.Error(AuthError.NOT_AUTH);
	}
	return db.insert({
		creatorId: userId,
		taskId,
		content,
		replyToId: null,
		repliedById: [],
		//both of the above are comment ids, not employee id
		createdAt: moment.now(),
		updatedAt: moment.now(),
	}, (err, comment) => {
		if (err) {
			throw new Meteor.Error(CommentError.COMMENT_INSERT_FAIL);
		} else {
			console.log(CommentMessage.COMMENT_CREATED, comment);
			addCommentToTask(Tasks, taskId, comment._id);
		}
	});
};

export const removeComment = (db, _id, userId) => {
	if (!isAuthenticated()) {
		throw new Meteor.Error(AuthError.NOT_AUTH);
	}
	console.log("[REMOVING COMMENT] ID is: ", _id);
	const comment = db.findOne({ _id }),
		{ creatorId } = comment;
	if (!comment) {
		throw new Meteor.Error(CommentError.COMMENT_NOT_EXIST);
	}
	console.log("[REMOVING COMMENT] Creator ID is: ", !!creatorId);
	console.log("[REMOVING COMMENT] Current User ID is: ", !!userId);
	if (!creatorId || !userId || creatorId !== userId) {
		console.log("[REMOVING COMMENT] Doing Auth...");
		throw new Meteor.Error(AuthError.NO_PRIVILEGE);
	}
	console.log("[REMOVING COMMENT] Finished Auth.");
	const { replyToId } = comment;
	return db.remove({ _id }, err => {
		if (err) {
			throw new Meteor.Error(CommentError.COMMENT_REMOVE_FAIL);
		}
		//for comments that replies to this comment, they will get null from frontend, as how it should be
		//and the ui should deal with it by displaying "the original comment no longer exist"
		if (replyToId) {
			const { repliedById } = db.findOne({ _id: replyToId }),
				newRepliedById = removeElement(repliedById, _id);
			return db.update({ _id: replyToId }, { repliedById: newRepliedById });
		}
	});
};

export const editComment = (db, _id, userId, newContent) => {
	if (!isAuthenticated()) {
		throw new Meteor.Error(AuthError.NOT_AUTH);
	}
	const comment = db.findOne({ _id }).fetch(),
		{ creatorId } = comment;
	if (!comment) {
		throw new Meteor.Error(CommentError.COMMENT_NOT_EXIST);
	}
	if (creatorId !== userId) {
		throw new Meteor.Error(AuthError.NO_PRIVILEGE);
	}
	return db.update({ _id }, { content: newContent, updatedAt: moment.now() }, err => {
		if (err) {
			throw new Meteor.Error(CommentError.COMMENT_EDIT_FAIL);
		}
	});
};

export const commentRepliedBy = (db, _id, replyerId) => {
	if (!isAuthenticated()) {
		throw new Meteor.Error(AuthError.NOT_AUTH);
	}
	const comment = db.findOne({ _id }).fetch(),
		replyerComment = db.findOne({ _id: replyerId }).fetch();
	if (!comment || !replyerComment) {
		throw new Meteor.Error(CommentError.COMMENT_NOT_EXIST);
	}
	const { repliedById } = comment,
		newRepliedById = addToList(repliedById, replyerId);
	return db.update({ _id }, { repliedById: newRepliedById }, err => {
		if (err) {
			throw new Meteor.Error(CommentError.COMMENT_REPLY_FAIL);
		}
	});
};

export const replyComment = (db, replyToId, taskId, content) => {
	if (!isAuthenticated()) {
		throw new Meteor.Error(AuthError.NOT_AUTH);
	}
	const newComment = insertComment(db, taskId, content),
		replyToComment = db.findOne({ _id: replyToId }),
		{ _id } = newComment;
	if (!replyToComment) {
		throw new Meteor.Error(CommentError.COMMENT_NOT_EXIST);
	}
	return db.update({ _id }, { replyToId }, err => {
		if (err) {
			throw new Meteor.Error(CommentError.COMMENT_REPLY_FAIL);
		} else {
			commentRepliedBy(db, replyToId, _id);
		}
	});
};

Meteor.methods({
	[COMMENTSAPI.INSERT](taskId, content) {
		return insertComment(Comments, this.userId, taskId, content);
	},
	//entry point: tasks.removeComment()
	[COMMENTSAPI.REMOVE](_id) {
		return removeComment(Comments, _id, this.userId);
	},
	[COMMENTSAPI.EDIT](_id, newContent) {
		return editComment(Comments, _id, this.userId, newContent);
	},
	[COMMENTSAPI.REPLY](replyToId, taskId, content) {
		return replyComment(Comments, replyToId, taskId, content);
	},
	[COMMENTSAPI.REPLIED_BY](_id, replyerId) {
		return commentRepliedBy(Comments, _id, replyerId);
	},
});
