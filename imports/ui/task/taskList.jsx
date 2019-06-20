import React from "react";
import TaskItem from "./taskItem.jsx";

const TaskList = ({ items }) => (
	<div>
		{items.map(item => <TaskItem item={item} />)}
	</div>
);

export default TaskList;
