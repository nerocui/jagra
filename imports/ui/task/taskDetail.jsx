import React from "react";
import { connect } from "react-redux";
import { Meteor } from "meteor/meteor";
import Center from "react-center";
import { Stack, DatePicker, DayOfWeek } from "office-ui-fabric-react";
import EditableTextfield from "../input/editableTextfield.jsx";
import TASKSAPI from "../../constant/methods/tasksAPI";
import DatePickerConfig from "../../config/uiConfig/datePickerConfig";
import CommentContainer from "../comment/commentContainer.jsx";

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
					<p>Created at: {this.props.detailItem.createdAt.toString()}</p>
					<p>Due:</p>
					<DatePicker
						strings={DatePickerConfig.DayPickerStrings}
						firstDayOfWeek={DayOfWeek.Sunday}
						allowTextInput={false}
						placeholder="Please enter due date"
						ariaLabel="Please enter due date"
						isRequired={false}
						value={this.props.detailItem.dueDate}
						onSelectDate={this.onDueDateSubmit}
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
				<CommentContainer
					subscriptionId="commentsByTaskId"
					_id={this.props.detailItem._id}
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
