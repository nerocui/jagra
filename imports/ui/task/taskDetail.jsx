import React from "react";
import { connect } from "react-redux";
import { Meteor } from "meteor/meteor";
import Center from "react-center";
import { Stack } from "office-ui-fabric-react";
import EditableTextfield from "../input/editableTextfield.jsx";
import TASKSAPI from "../../constant/methods/tasksAPI";

class TaskDetail extends React.Component {
	constructor(props) {
		super(props);
		this.onDescriptionSubmit = this.onDescriptionSubmit.bind(this);
		this.renderDetailPage = this.renderDetailPage.bind(this);
		this.renderEmptyPage = this.renderEmptyPage.bind(this);
	}

	onDescriptionSubmit(description) {
		Meteor.call(TASKSAPI.UPDATE_DESCRIPTION, this.props.detailItem._id, description);
	}

	renderDetailPage() {
		return (
			<div>
				<h2>{this.props.detailItem.title}</h2>
				<div>
					<p>Status: {this.props.detailItem.status}</p>
					<p>Created at: {this.props.detailItem.createdAt}</p>
					<p>Due: {this.props.detailItem.dueDate.toString()}</p>
					<p>Created by: {this.props.detailItem.creatorId}</p>
					<p>Assigned to: {this.props.detailItem.assingeeId}</p>
					<div>
						<p>Watched by: </p>
						{this.props.detailItem.watchersId.map(watcher => <p>{watcher}</p>)}
					</div>
				</div>
				<h3>Description</h3>
				<EditableTextfield
					value={this.props.detailItem.description}
					onValueSubmit={this.onDescriptionSubmit}
				/>

			</div>
		);
	}

	renderEmptyPage() {
		return (
			<Center className="full-with full-height">
				<Stack horizontalAlign="center">
					<img src="/taskicon.png" className="center-icon" alt="task icon" />
					<p>Choose A Task To Get Started</p>
				</Stack>
			</Center>
		);
	}

	render() {
		return (
			<div className="component--task__detail-container">
				{this.props.detailItem && this.props.detailItem._id ? this.renderDetailPage() : this.renderEmptyPage() }
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
