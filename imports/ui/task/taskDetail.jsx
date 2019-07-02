import React from "react";

const TaskDetail = ({ item }) => (
	<div className="component--task__detail-container">
		{item
		? (
			<div>
				task detail {item._id}
			</div>
		)
		: (
			<div>
				choose a task
			</div>
		)}
	</div>
);

export default TaskDetail;
