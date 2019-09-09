import { Meteor } from "meteor/meteor";
import { Comments, Tasks, Employees } from "./db";
import { AuthError, CommentError, TaskError } from "../constant/error";
import COMMENTSAPI from "../constant/methods/commentsAPI";
import { CommentMessage } from "../constant/message";
import { addToList, removeElement } from "../util/arrayUtil";
import { isAuthenticated } from "../util/authUtil";
import { COMMENTS_SUBSCRIPTION } from "../constant/subscription";

if (Meteor.isServer) {
	Meteor.publish(COMMENTS_SUBSCRIPTION.COMMENTS_BY_TASK_ID, taskId => Comments.find({ taskId }));
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
	return db.update({ _id }, { $set: { commentsId: newCommentsId } });
};

export const insertComment = (db, userId, creatorName, taskId, content) => {
	if (!isAuthenticated()) {
		throw new Meteor.Error(AuthError.NOT_AUTH);
	}
	const now = new Date(Date.now());
	return db.insert({
		creatorId: userId,
		creatorName,
		taskId,
		content,
		replyToId: null,
		repliedById: [],
		//both of the above are comment ids, not employee id
		createdAt: now,
		updatedAt: now,
	}, (err, comment) => {
		if (err) {
			throw new Meteor.Error(CommentError.COMMENT_INSERT_FAIL);
		} else {
			console.log(CommentMessage.COMMENT_CREATED, comment);
			addCommentToTask(Tasks, taskId, comment);
		}
	});
};

export const removeComment = (db, _id, userId) => {
	if (!isAuthenticated()) {
		throw new Meteor.Error(AuthError.NOT_AUTH);
	}
	const comment = db.findOne({ _id }),
		{ creatorId } = comment;
	if (!comment) {
		throw new Meteor.Error(CommentError.COMMENT_NOT_EXIST);
	}
	if (!creatorId || !userId || creatorId !== userId) {
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
			const { repliedById } = db.findOne({ _id: replyToId }),
				newRepliedById = removeElement(repliedById, _id);
			return db.update({ _id: replyToId }, { $set: { repliedById: newRepliedById } });
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
	const now = new Date(Date.now());
	return db.update({ _id }, { $set: { content: newContent, updatedAt: now } }, err => {
		if (err) {
			throw new Meteor.Error(CommentError.COMMENT_EDIT_FAIL);
		}
	});
};

export const commentRepliedBy = (db, _id, replyerId) => {
	if (!isAuthenticated()) {
		throw new Meteor.Error(AuthError.NOT_AUTH);
	}
	const comment = db.findOne({ _id }),
		replyerComment = db.findOne({ _id: replyerId });
	if (!comment || !replyerComment) {
		throw new Meteor.Error(CommentError.COMMENT_NOT_EXIST);
	}
	const { repliedById } = comment,
		newRepliedById = addToList(repliedById, replyerId);
	return db.update({ _id }, { $set: { repliedById: newRepliedById } }, err => {
		if (err) {
			throw new Meteor.Error(CommentError.COMMENT_REPLY_FAIL);
		}
	});
};

export const replyComment = (db, userId, creatorName, replyToId, taskId, content) => {
	if (!isAuthenticated()) {
		throw new Meteor.Error(AuthError.NOT_AUTH);
	}
	const _id = insertComment(db, userId, creatorName, taskId, content),
		replyToComment = db.findOne({ _id: replyToId });
	if (!replyToComment) {
		throw new Meteor.Error(CommentError.COMMENT_NOT_EXIST);
	}
	db.update({ _id }, { $set: { replyToId } }, err => {
		if (err) {
			throw new Meteor.Error(CommentError.COMMENT_REPLY_FAIL);
		}
	});
	commentRepliedBy(db, replyToId, _id);
};

function getCreatorName(_id) {
	const creator = Employees.findOne({ _id });
	return `${ creator.firstName } ${ creator.lastName }`;
}

Meteor.methods({
	[COMMENTSAPI.INSERT](taskId, content) {
		return insertComment(Comments, this.userId, getCreatorName(this.userId), taskId, content);
	},
	//entry point: tasks.removeComment()
	[COMMENTSAPI.REMOVE](_id) {
		return removeComment(Comments, _id, this.userId);
	},
	[COMMENTSAPI.EDIT](_id, newContent) {
		return editComment(Comments, _id, this.userId, newContent);
	},
	[COMMENTSAPI.REPLY](replyToId, taskId, content) {
		return replyComment(Comments, this.userId, getCreatorName(this.userId), replyToId, taskId, content);
	},
	[COMMENTSAPI.REPLIED_BY](_id, replyerId) {
		return commentRepliedBy(Comments, _id, replyerId);
	},
});
