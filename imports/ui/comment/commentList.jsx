import React from "react";
import { connect } from "react-redux";
import CommentListItem from "./commentListItem.jsx";

class CommentList extends React.PureComponent {
	render() {
		return (
			<div className="component--content__list">
				{this.props.items.map(item => (<CommentListItem {...item} key={item._id} />))}
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		items: state.commentList.length ? state.commentList : [],
	};
}

export default connect(mapStateToProps)(CommentList);
