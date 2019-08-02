import React from "react";
import { connect } from "react-redux";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import { Comments } from "../../api/db";
import CommentFilter from "./commentFilter.jsx";
import CommentList from "./commentList.jsx";
import CommentEditor from "./commentEditor.jsx";
import * as actions from "../../actions/index";

class CommentContainer extends React.PureComponent {
	render() {
		this.props.setCommentList(this.props.items);
		return (
			<div className="component--comment__container">
				<CommentFilter />
				<CommentList />
				<CommentEditor taskId={this.props._id} />
			</div>
		);
	}
}

function mapDispatchToProps(dispatch) {
	return {
		setCommentList: items => dispatch(actions.setCommentList(items)),
	};
}

const CommentContainerWithTracker = withTracker(({ subscriptionId, _id }) => {
	const commentHandle = Meteor.subscribe(subscriptionId, _id);
	const loading = !commentHandle.ready();
	const items = Comments.find({}).fetch() || [];
	return {
		_id,
		loading,
		items,
	};
})(CommentContainer);

export default connect(null, mapDispatchToProps)(CommentContainerWithTracker);
