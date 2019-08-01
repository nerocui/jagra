import React from "react";
import CommentListItem from "./commentListItem.jsx";

const CommentList = ({ items }) => (
	<div>
		<div>Comment List</div>
		{items.map(item => (<CommentListItem {...item} />))}
	</div>
);

export default CommentList;
