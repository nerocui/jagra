import React from "react";
import { Link } from "react-router-dom";
import queryString from "query-string";

const TaskItem = ({
 title,
 _id,
 dueDate,
}) => {
	const queries = queryString.parse(window.location.search);
	return (
		<div className="component--task__item-container">
			<Link to={`?subscriptionId=${ queries.subscriptionId }&taskId=${ _id }`}>
				<p>Task: {title}</p>
				<h3>dueDate: {dueDate?dueDate.toString():""}</h3>
			</Link>
		</div>
	);
};


export default TaskItem;
