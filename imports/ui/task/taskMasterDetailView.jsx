import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { Stack } from "office-ui-fabric-react";
import queryString from "query-string";
import TaskList from "./taskList.jsx";
import TaskDetail from "./taskDetail.jsx";
import { Tasks } from "../../api/db";


class TaskMasterDetailView extends Component {
	constructor(props) {
		super(props);
		const queries = queryString.parse(window.location.search);
		this.state = {
			chosenId: queries.taskId,
		};
	}

	getItem() {
		return this.state.chosenId ? this.props.items.find(item => item._id === this.state.chosenId) : null;
	}

	itemClickHandler(e) {
		console.log(e.target);
	}

	render() {
		return (
			<Stack horizontal>
				<TaskList items={this.props.items || []} />
				<TaskDetail item={this.getItem()} />
			</Stack>
		);
	}
}

const TaskMasterDetailViewContainer = withTracker(({ subscriptionId }) => {
	console.log(`Getting subscription ${ subscriptionId }`);
	const myTaskListHandle = Meteor.subscribe(subscriptionId);
	const loading = !myTaskListHandle.ready();
	return {
		loading,
		items: Tasks.find({}).fetch() || [],
	};
})(TaskMasterDetailView);

export default TaskMasterDetailViewContainer;
