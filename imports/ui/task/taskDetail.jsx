import React from "react";
import { connect } from "react-redux";
import { Meteor } from "meteor/meteor";
import EditableTextfield from "../input/editableTextfield.jsx";
import TASKSAPI from "../../constant/methods/tasksAPI";

class TaskDetail extends React.Component {
	constructor(props) {
		super(props);
		this.onDescriptionSubmit = this.onDescriptionSubmit.bind(this);
	}

	onDescriptionSubmit(description) {
		Meteor.call(TASKSAPI.UPDATE_DESCRIPTION, this.props.detailItem._id, description);
	}

	render() {
		return (
			<div className="component--task__detail-container">
				{this.props.detailItem && this.props.detailItem._id
				? (
					<EditableTextfield
						value={this.props.detailItem.description}
						editorKey="description"
						onValueSubmit={this.onDescriptionSubmit}
					/>
				)
				: (
					<div>
						choose a task
					</div>
				)}
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		detailItem: state.taskDetailView.detailItem,
	};
}

export default connect(mapStateToProps)(TaskDetail);
