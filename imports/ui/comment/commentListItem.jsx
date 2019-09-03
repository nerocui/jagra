import React from "react";
import CommentEditor from "./commentEditor.jsx";

class CommentListItem extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			replying: false,
		};
		this.onReplying = this.onReplying.bind(this);
		this.onCancel = this.onCancel.bind(this);
	}

	onReplying() {
		this.setState({ replying: true });
	}

	onCancel() {
		this.setState({ replying: false });
	}

	renderReply() {
		if (this.props.replies) {
			return this.props.replies.map(reply => (
				<CommentListItem {...reply} key={reply._id} />
			));
		}
	}

	renderContent() {
		return (
			<div>
				<span>
					<span>{this.props.creatorName}: </span>
					{ this.props.content }
					<button type="button" onClick={this.onReplying}>
						reply
					</button>
				</span>
				<div className="element--comment__reply-box">
					{this.renderReply()}
				</div>
			</div>
		);
	}

	renderEditor() {
		if (this.state.replying) {
			return (
				<CommentEditor replyToId={this.props._id} onCancel={this.onCancel} />
				//add the ability to config the editor to a reply mode
			);
		}
	}

	render() {
		return (
			<div className="element--comment__list-item">
				<div>
					{this.renderContent()}
				</div>
				<div>
					{this.renderEditor()}
				</div>
			</div>
		);
	}
}

export default CommentListItem;
