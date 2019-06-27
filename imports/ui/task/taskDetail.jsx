import React from "react";

const TaskDetail = ({ item }) => (
	<div>
		{item ? <div>task detail {item._id}</div> : <div>choose a task</div>}
	</div>
);

export default TaskDetail;
