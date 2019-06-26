import React from "react";
import TaskItem from "./taskItem.jsx";

const TaskList = ({ items }) => (
	<div>
		{items.map(item => <TaskItem item={item} key={item._id} />)}
	</div>
);

export default TaskList;
