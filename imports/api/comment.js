import { Meteor } from "meteor/meteor";
import moment from "moment";
import { Comments } from "./db";
import { AuthError, CommentError } from "../constant/error";
import COMMENTSAPI from "../constant/methods/commentsAPI";
import TASKSAPI from "../constant/methods/tasksAPI";
import { CommentMessage } from "../constant/message";
import { addToList, removeElement } from "../util/arrayUtil";
import { isAuthenticated } from "../util/authUtil";

if (Meteor.isServer) {
	Meteor.publish("comments", () => Comments.find());
}

export const insertComment = (db, taskId, content) => {
	if (!isAuthenticated()) {
		throw new Meteor.Error(AuthError.NOT_AUTH);
	}
	return db.insert({
		creatorId: this.userId,
		taskId,
		content,
		replyToId: null,
		repliedById: [],
		createdAt: moment.now(),
		updatedAt: moment.now(),
	}, (err, comment) => {
		if (err) {
			throw new Meteor.Error(CommentError.COMMENT_INSERT_FAIL);
		} else {
			console.log(CommentMessage.COMMENT_CREATED, comment);
			Meteor.call(TASKSAPI.ADD_COMMENT, taskId, comment._id);
		}
	});
}

export const removeComment = (db, _id) => {
	if (!isAuthenticated()) {
		throw new Meteor.Error(AuthError.NOT_AUTH);
	}
	const comment = db.findOne({ _id }).fetch(),
		{ creatorId } = comment;
	if (!comment) {
		throw new Meteor.Error(CommentError.COMMENT_NOT_EXIST);
	}
	if (creatorId !== this.userId) {
		throw new Meteor.Error(AuthError.NO_PRIVILEGE);
	}
	const { replyToId } = comment;
	return db.remove({ _id }, err => {
		if (err) {
			throw new Meteor.Error(CommentError.COMMENT_REMOVE_FAIL);
		}
		//for comments that replies to this comment, they will get null from frontend, as how it should be
		//and the ui should deal with it by displaying "the original comment no longer exist"
		if (replyToId) {
			const { repliedById } = db.findOne({ _id: replyToId }).fetch(),
				newRepliedById = removeElement(repliedById, _id);
			return db.update({ _id: replyToId }, { repliedById: newRepliedById });
		}
	});
}

export const editComment = (db, _id, newContent) => {
	if (!isAuthenticated()) {
		throw new Meteor.Error(AuthError.NOT_AUTH);
	}
	const comment = db.findOne({ _id }).fetch(),
		{ creatorId } = comment;
	if (!comment) {
		throw new Meteor.Error(CommentError.COMMENT_NOT_EXIST);
	}
	if (creatorId !== this.userId) {
		throw new Meteor.Error(AuthError.NO_PRIVILEGE);
	}
	return db.update({ _id }, { content: newContent, updatedAt: moment.now() }, err => {
		if (err) {
			throw new Meteor.Error(CommentError.COMMENT_EDIT_FAIL);
		}
	});
}

export const replyComment = (db, replyToId, taskId, content) => {
	if (!isAuthenticated()) {
		throw new Meteor.Error(AuthError.NOT_AUTH);
	}
	const newComment = Meteor.call(COMMENTSAPI.INSERT, taskId, content),
		replyToComment = db.findOne({ _id: replyToId }).fetch(),
		{ _id } = newComment;
	if (!replyToComment) {
		throw new Meteor.Error(CommentError.COMMENT_NOT_EXIST);
	}
	return db.update({ _id }, { replyToId }, err => {
		if (err) {
			throw new Meteor.Error(CommentError.COMMENT_REPLY_FAIL);
		} else {
			Meteor.call(COMMENTSAPI.REPLIED_BY, replyToId, _id);
		}
	});
}

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
}

Meteor.methods({
	[COMMENTSAPI.INSERT](taskId, content) {
		insertComment(Comments, taskId, content);
	},
	//entry point: tasks.removeComment()
	[COMMENTSAPI.REMOVE](_id) {
		removeComment(Comments, _id);
	},
	[COMMENTSAPI.EDIT](_id, newContent) {
		editComment(Comments, _id, newContent);
	},
	[COMMENTSAPI.REPLY](replyToId, taskId, content) {
		replyComment(Comments, replyToId, taskId, content);
	},
	[COMMENTSAPI.REPLIED_BY](_id, replyerId) {
		commentRepliedBy(Comments, _id, replyerId);
	},
});
