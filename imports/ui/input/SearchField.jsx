import React from "react";
import { SearchBox } from "office-ui-fabric-react";
import CLICK_MODE from "../../constant/actions/searchMode";

const SearchField = ({
	searchDomain, //[employee, task, comment, file, ]
	searchTerm, //""
	choices, //[] things user chose
	numberOfChoice, //int
	dataPool, //[{type: employee/task/comment/file, index: [key words...], link, content }]
	clickMode, //select/navigate
	size, //normal/large
	onSearchChange,
	onSearchRequest,
	onSearchFocus,
}) => {
	const _searchDomain = [...searchDomain];
	const _choices = [...choices].slice(0, numberOfChoice);
	const _datapool = [...dataPool];
	const disabled = (_searchDomain.length === 0) || (parseInt(numberOfChoice, 10) <= choices.length);
	return (
		<div className="component--input__search-container">
			<SearchBox
				value={searchTerm}
				className={size}
				placeholder="Search"
				onChange={onSearchChange}
				onSearch={onSearchRequest}
				onFocus={onSearchFocus}
				disabled={disabled}
			/>
			<div>
				{clickMode === CLICK_MODE.SELECTION
				? (
					<div>
						{_choices.map(choice => (
							<div>
								{choice}
							</div>
						))}
					</div>
				) : <div />}
			</div>
			<div>
				{_datapool.map(data => (
					<div key={data._id}>
						{data.title}
					</div>
				))}
			</div>
		</div>
	);
};

export default SearchField;
