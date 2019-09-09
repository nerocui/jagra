import React from "react";
import { connect } from "react-redux";
import { withTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { Tasks } from "../../api/db";
import * as actions from "../../actions/index";
import TaskDetail from "./taskDetail.jsx";

class TaskDetailContainer extends React.PureComponent {
	render() {
		this.props.setTaskDetailItem(Object.assign({}, this.props.detailItem));
		return (
			<TaskDetail {...this.props} fullWidth />
		);
	}
}

function mapDispatchToProps(dispatch) {
	return {
		setTaskDetailItem: item => dispatch(actions.setTaskDetailItem(item)),
	};
}

export default withTracker(({ taskId }) => {
	const taskDetailHandle = Meteor.subscribe("singleTask", taskId);
	const loading = !taskDetailHandle.ready();
	const task = Tasks.findOne({ _id: taskId });
	return {
		loading,
		detailItem: task,
	};
})(connect(null, mapDispatchToProps)(TaskDetailContainer));
