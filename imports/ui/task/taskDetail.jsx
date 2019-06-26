import React from "react";

const TaskDetail = props => (
	<div>
		{props._id ? <div>task detail</div> : <div>choose a task</div>}
	</div>
);

export default TaskDetail;
