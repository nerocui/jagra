import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { withTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { Stack } from "office-ui-fabric-react";
import TaskList from "./taskList.jsx";
import TaskDetail from "./taskDetail.jsx";
import { Tasks } from "../../api/db";
import * as actions from "../../actions/index";


class TaskMasterDetailView extends PureComponent {
	render() {
		let items = this.props.items || [];
		const isChosen = item => (this.props.chosenItem ? item._id === this.props.chosenItem._id : false);
		items = items.map(item => ({ ...item, chosen: isChosen(item) }));
		this.props.setTaskDetailItem(Object.assign({}, this.props.chosenItem));
		return (
			<div className="component--task__master-detail">
				<Stack horizontal>
					<TaskList items={items} />
					<TaskDetail />
				</Stack>
			</div>
		);
	}
}

function mapDispatchToProps(dispatch) {
	return {
		setTaskDetailItem: item => dispatch(actions.setTaskDetailItem(item)),
	};
}

const TaskMasterDetailViewContainer = withTracker(({ subscriptionId, taskId }) => {
	const myTaskListHandle = Meteor.subscribe(subscriptionId);
	const loading = !myTaskListHandle.ready();
	const items = Tasks.find({}).fetch() || [];
	const chosenItem = Tasks.findOne({ _id: taskId });
	return {
		loading,
		items,
		chosenItem,
	};
})(TaskMasterDetailView);

export default connect(null, mapDispatchToProps)(TaskMasterDetailViewContainer);
