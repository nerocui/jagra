import React from "react";
import TaskItem from "./taskItem.jsx";

const TaskList = ({ items }) => (
	<div className="component--task__list-container">
		{items.map(
			item => (
			<TaskItem
				title={item.title}
				_id={item._id}
				dueDate={item.dueDate}
				key={item._id}
			/>
			),
		)}
	</div>
);

export default TaskList;
