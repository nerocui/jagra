import React from "react";
import CommentListItem from "./commentListItem.jsx";

const CommentList = ({ items }) => (
	<div className="component--content__list">
		{items.map(item => (<CommentListItem {...item} />))}
	</div>
);

export default CommentList;
