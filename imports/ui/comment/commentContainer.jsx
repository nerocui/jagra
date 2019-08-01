import React from "react";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import { Comments } from "../../api/db";
import CommentFilter from "./commentFilter.jsx";
import CommentList from "./commentList.jsx";
import CommentEditor from "./commentEditor.jsx";

const CommentContainer = ({ Id, items }) => (
	<div className="component--comment__container">
		<CommentFilter />
		<CommentList items={items} />
		<CommentEditor taskId={Id} />
	</div>
);

const CommentContainerWithTracker = withTracker(({ subscriptionId, Id }) => {
	const commentHandle = Meteor.subscribe(subscriptionId, Id);
	const loading = !commentHandle.ready();
	const items = Comments.find({}).fetch() || [];
	return {
		Id,
		loading,
		items,
	};
})(CommentContainer);

export default CommentContainerWithTracker;
