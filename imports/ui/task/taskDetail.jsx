import React from "react";
import { connect } from "react-redux";
import { Meteor } from "meteor/meteor";
import Center from "react-center";
import { Stack } from "office-ui-fabric-react";
import EditableTextfield from "../input/editableTextfield.jsx";
import EditableDatePicker from "../input/editableDatePicker.jsx";
import TASKSAPI from "../../constant/methods/tasksAPI";

class TaskDetail extends React.Component {
	constructor(props) {
		super(props);
		this.onDescriptionSubmit = this.onDescriptionSubmit.bind(this);
		this.onDueDateSubmit = this.onDueDateSubmit.bind(this);
		this.onTitleSubmit = this.onTitleSubmit.bind(this);
		this.renderDetailPage = this.renderDetailPage.bind(this);
		this.renderEmptyPage = this.renderEmptyPage.bind(this);
	}

	onTitleSubmit(title) {
		Meteor.call(TASKSAPI.UPDATE_TITLE, this.props.detailItem._id, title);
	}

	onDescriptionSubmit(description) {
		Meteor.call(TASKSAPI.UPDATE_DESCRIPTION, this.props.detailItem._id, description);
	}

	onDueDateSubmit(dueDate) {
		console.log("Called due date submit with duedate: ", dueDate);
		Meteor.call(TASKSAPI.CHANGE_DUE_DATE, this.props.detailItem._id, dueDate);
	}

	renderDetailPage() {
		return (
			<div>
				<EditableTextfield
					value={this.props.detailItem.title}
					onValueSubmit={this.onTitleSubmit}
				/>
				<div>
					<p>Status: {this.props.detailItem.status}</p>
					<p>Created at: {this.props.detailItem.createdAt}</p>
					<p>Due: {this.props.detailItem.dueDate.toString()}</p>
					<EditableDatePicker
						value={this.props.detailItem.dueDate}
						onValueSubmit={this.onDueDateSubmit}
						minDate={new Date(Date.now())}
						placeholder="Please enter due date"
						isRequired={false}
					/>
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
