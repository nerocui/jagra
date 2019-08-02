import React from "react";
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
	}

	onSubmit(e) {
		e.preventDefault();
		Meteor.call(COMMENTSAPI.INSERT, this.props.taskId, this.state.content);
		this.setState({ content: "" });
	}

	onChange(e) {
		e.preventDefault();
		this.setState({ content: e.target.value });
	}

	render() {
		return (
			<div>
				<form onSubmit={this.onSubmit}>
					<input value={this.state.content} onChange={this.onChange} />
					<button type="submit">Comment</button>
					{this.props.replyeeId
						? (
							<button
								type="button"
								onClick={this.props.onCancel}
							>
								Cancel
							</button>
							)
						: <span />}
				</form>
			</div>
		);
	}
}

export default CommentEditor;
