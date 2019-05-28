/* eslint-disable no-unused-expressions */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-undef */
/* eslint-disable func-names */
import { Meteor } from "meteor/meteor";
import chai from "chai";
import { Comments } from "./db";
import "./comment";
import "./employee";
import COMMENTAPI from "../constant/methods/commentsAPI";
import { signup, login } from "../util/authUtil";

if (Meteor.isServer) {
	const { expect } = chai;
	describe("Comment API Tests", function () {
		signup("test@email.com", "123456789", "test", "name");
		if (!this.userId) {
			login("test@email.com", 123456789);
		}
		const comment1 = "content11";
		Comments.remove({});
		//const _id = insertComment(Comments, "taskId1", comment1);
		const _id = Meteor.call(COMMENTAPI.INSERT, "taskId1", comment1);
		console.log("[COMMENT TEST] ID is: ", _id);
		it("Should insert a comment to the db", function () {
			const comment = Comments.findOne({ _id });
			expect(comment).to.not.be.undefined;
			expect(Comments.find().fetch()).to.have.lengthOf(1);
		});

		it("Should remove a comment from the db", function () {
			//removeComment(Comments, _id);
			expect(
				Meteor.call(COMMENTAPI.REMOVE, _id),
			).to.not.throw;
			const comment = Comments.findOne({ _id });
			console.log(comment);
			expect(comment).to.be.undefined;
			expect(Comments.find().fetch()).to.have.lengthOf(0);
			console.log("[COMMENT TEST] Finished removal test.");
		});
	});
}
