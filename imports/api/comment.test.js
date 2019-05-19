/* eslint-disable no-unused-expressions */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-undef */
/* eslint-disable func-names */
import { Meteor } from "meteor/meteor";
import chai from "chai";
import { Comments } from "./db";
import {
	insertComment,
	removeComment,
	// editComment,
	// replyComment,
	// commentRepliedBy,
} from "./comment";

if (Meteor.isServer) {
	const { expect } = chai;
	describe("Comment API Tests", function () {
		const comment1 = "content1";
		Comments.remove({});
		const _id = insertComment(Comments, "taskId1", comment1);
		
		it("Should insert a comment to the db", function () {
			const comment = Comments.findOne({ _id });
			expect(comment).to.not.be.undefined;
			expect(Comments.find().fetch()).to.have.lengthOf(1);
		});

		it("Should remove a comment from the db", function () {
			removeComment(Comments, _id);
			const comment = Comments.findOne({ _id });
			console.log(comment);
			expect(comment).to.be.undefined;
			expect(Comments.find().fetch()).to.have.lengthOf(0);
		});
	});
}
