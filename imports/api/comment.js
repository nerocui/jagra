import { Meteor } from "meteor/meteor";
import moment from "moment";
import { Comments } from "./db";
import { AuthError, CommentError } from "../constant/error";
import COMMENTSAPI from "../constant/methods/commentsAPI";
import TASKSAPI from "../constant/methods/tasksAPI";
import { CommentMessage } from "../constant/message";
import { addToList, removeElement } from "../util/arrayUtil";

if (Meteor.isServer) {
	Meteor.publish("comments", () => Comments.find());
	//TODO: figure what to publish
}

Meteor.methods({
	[COMMENTSAPI.INSERT](taskId, content) {
		if (!this.userId) {
			throw new Meteor.Error(AuthError.NOT_AUTH);
		}
		return Comments.insert({
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
	},
	[COMMENTSAPI.REMOVE](_id) {
		if (!this.userId) {
			throw new Meteor.Error(AuthError.NOT_AUTH);
		}
		const comment = Comments.findOne({ _id }).fetch(),
			{ creatorId } = comment;
		if (!comment) {
			throw new Meteor.Error(CommentError.COMMENT_NOT_EXIST);
		}
		if (creatorId !== this.userId) {
			throw new Meteor.Error(AuthError.NO_PRIVILEGE);
		}
		const { replyToId } = comment;
		return Comments.remove({ _id }, err => {
			if (err) {
				throw new Meteor.Error(CommentError.COMMENT_REMOVE_FAIL);
			}
			//for comments that replies to this comment, they will get null from frontend, as how it should be
			//and the ui should deal with it by displaying "the original comment no longer exist"
			if (replyToId) {
				const { repliedById } = Comments.findOne({ _id: replyToId }).fetch(),
					newRepliedById = removeElement(repliedById, _id);
				return Comments.update({ _id: replyToId }, { repliedById: newRepliedById });
			}
		});
	},
	[COMMENTSAPI.EDIT](_id, newContent) {
		if (!this.userId) {
			throw new Meteor.Error(AuthError.NOT_AUTH);
		}
		const comment = Comments.findOne({ _id }).fetch(),
			{ creatorId } = comment;
		if (!comment) {
			throw new Meteor.Error(CommentError.COMMENT_NOT_EXIST);
		}
		if (creatorId !== this.userId) {
			throw new Meteor.Error(AuthError.NO_PRIVILEGE);
		}
		return Comments.update({ _id }, { content: newContent, updatedAt: moment.now() }, err => {
			if (err) {
				throw new Meteor.Error(CommentError.COMMENT_EDIT_FAIL);
			}
		});
	},
	[COMMENTSAPI.REPLY](replyToId, taskId, content) {
		if (!this.userId) {
			throw new Meteor.Error(AuthError.NOT_AUTH);
		}
		const newComment = Meteor.call(COMMENTSAPI.INSERT, taskId, content),
			replyToComment = Comments.findOne({ _id: replyToId }).fetch(),
			{ _id } = newComment;
		if (!replyToComment) {
			throw new Meteor.Error(CommentError.COMMENT_NOT_EXIST);
		}
		return Comments.update({ _id }, { replyToId }, err => {
			if (err) {
				throw new Meteor.Error(CommentError.COMMENT_REPLY_FAIL);
			} else {
				Meteor.call(COMMENTSAPI.REPLIED_BY, replyToId, _id);
			}
		});
	},
	[COMMENTSAPI.REPLIED_BY](_id, replyerId) {
		if (!this.userId) {
			throw new Meteor.Error(AuthError.NOT_AUTH);
		}
		const comment = Comments.findOne({ _id }).fetch(),
			replyerComment = Comments.findOne({ _id: replyerId }).fetch();
		if (!comment || !replyerComment) {
			throw new Meteor.Error(CommentError.COMMENT_NOT_EXIST);
		}
		const { repliedById } = comment,
			newRepliedById = addToList(repliedById, replyerId);
		return Comments.update({ _id }, { repliedById: newRepliedById }, err => {
			if (err) {
				throw new Meteor.Error(CommentError.COMMENT_REPLY_FAIL);
			}
		});
	},
});
