import React from "react";

const SuggestionBox = ({
	dataPool,
}) => {
	const _datapool = [...dataPool];
	return (
		<div className="component--inpit__search-suggestion">
			{_datapool.map(data => (
				<div key={data._id}>
					{data.title}
				</div>
			))}
		</div>
	);
};

export default SuggestionBox;
