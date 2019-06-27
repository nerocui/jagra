import React from "react";
import { Link } from "react-router-dom";

const TaskItem = ({
 title,
 _id,
 dueDate,
}) => (
	<Link to={`?_id=${ _id }`}>
		<div>ID: {_id}</div>
		<div>Task: {title}</div>
		<div>dueDate: {dueDate}</div>
	</Link>
);

export default TaskItem;
