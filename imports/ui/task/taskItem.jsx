import React from "react";
import { Link } from "react-router-dom";
import queryString from "query-string";
import { Stack } from "office-ui-fabric-react";
import dateformat from "dateformat";

const TaskItem = ({
	title,
	_id,
	dueDate,
	chosen,
}) => {
	const queries = queryString.parse(window.location.search);
	return (
		<div className={`component--task__item-container ${ chosen ? "component--task__item-chosen" : "" }`}>
			<Link to={`?subscriptionId=${ queries.subscriptionId }&taskId=${ _id }`}>
				<Stack>
					<Stack.Item>
						<p className="element--text_basic">{title}</p>
					</Stack.Item>
					<Stack.Item align="end">
						<p className="element--text_basic">{dueDate ? `Due ${ dateformat(dueDate, "yyyy-mm-dd") }` : ""}</p>
					</Stack.Item>
				</Stack>
				
			</Link>
		</div>
	);
};


export default TaskItem;
