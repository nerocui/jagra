import React from "react";

const TaskItem = ({ title, _id, dueDate, onTaskItemClick }) => (
	<div onClick={() => onTaskItemClick(_id)}>
		<div>ID: {_id}</div>
		<div>Task: {title}</div>
		<div>dueDate: {dueDate}</div>
	</div>
);

export default TaskItem;
