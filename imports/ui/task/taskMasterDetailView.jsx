import React, { PureComponent } from "react";
import { withTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { Stack } from "office-ui-fabric-react";
import TaskList from "./taskList.jsx";
import TaskDetail from "./taskDetail.jsx";
import { Tasks } from "../../api/db";


class TaskMasterDetailView extends PureComponent {
	render() {
		let items = this.props.items || [];
		const isChosen = item => (this.props.chosenItem ? item._id === this.props.chosenItem._id : false);
		items = items.map(item => ({ ...item, chosen: isChosen(item) }));
		return (
			<div className="component--task__master-detail">
				<Stack horizontal>
					<TaskList items={items} />
					<TaskDetail item={this.props.chosenItem} />
				</Stack>
			</div>
		);
	}
}

const TaskMasterDetailViewContainer = withTracker(({ subscriptionId, taskId }) => {
	console.log(`Getting subscription ${ subscriptionId }`);
	console.log(`Chose item with id: ${ taskId }`);
	const myTaskListHandle = Meteor.subscribe(subscriptionId);
	const loading = !myTaskListHandle.ready();
	return {
		loading,
		items: Tasks.find({}).fetch() || [],
		chosenItem: Tasks.findOne({ _id: taskId }),
	};
})(TaskMasterDetailView);

export default TaskMasterDetailViewContainer;
