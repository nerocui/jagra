import React from "react";
import { connect } from "react-redux";
import { Meteor } from "meteor/meteor";
import COMMENTSAPI from "../../constant/methods/commentsAPI";

class CommentEditor extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			content: "",
		};
		this.onSubmit = this.onSubmit.bind(this);
		this.onChange = this.onChange.bind(this);
		this.renderCommentForm = this.renderCommentForm.bind(this);
		this.renderReplyForm = this.renderReplyForm.bind(this);
		this.onReply = this.onReply.bind(this);
	}

	onSubmit(e) {
		e.preventDefault();
		Meteor.call(COMMENTSAPI.INSERT, this.props.task._id, this.state.content);
		this.setState({ content: "" });
	}

	onChange(e) {
		e.preventDefault();
		this.setState({ content: e.target.value });
	}

	onReply(e) {
		e.preventDefault();
		//TODO: check if empty (form validation)
		Meteor.call(COMMENTSAPI.REPLY, this.props.replyToId, this.props.task._id, this.state.content);
		this.setState({ content: "" });
		this.props.onCancel();
	}

	renderCommentForm() {
		return (
			<form onSubmit={this.onSubmit}>
				<input value={this.state.content} onChange={this.onChange} />
				<button type="submit">Comment</button>
			</form>
		);
	}

	renderReplyForm() {
		return (
			<form onSubmit={this.onReply}>
				<input value={this.state.content} onChange={this.onChange} autoFocus />
				<button type="submit">Reply</button>
				<button
					type="button"
					onClick={this.props.onCancel}
				>
					Cancel
				</button>
			</form>
		);
	}

	render() {
		return (
			<div>
				{this.props.replyToId ? this.renderReplyForm() : this.renderCommentForm()}
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		task: state.taskDetailView.detailItem,
	};
}

export default connect(mapStateToProps)(CommentEditor);
