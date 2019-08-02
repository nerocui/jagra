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

	renderContent() {
		return (
			<div>
				<span>
					{ this.props.content }
					<button type="button" onClick={this.onReplying}>
						reply
					</button>
				</span>
			</div>
		);
	}

	renderEditor() {
		if (this.state.replying) {
			return (
				<CommentEditor replyeeId={this.props._id} onCancel={this.onCancel} />
				//add the ability to config the editor to a reply mode
			);
		}
		return <span />;
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
