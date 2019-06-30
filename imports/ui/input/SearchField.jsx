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
	onSearchEscape,
	onSearchClear,
	onSearchChange,
	onSearchRequest,
	onSearchFocus,
	onSearchBlur,
}) => {
	const _searchDomain = [...searchDomain];
	const _choices = [...choices].slice(0, numberOfChoice);
	const _datapool = [...dataPool];
	const disabled = (_searchDomain.length === 0) || (parseInt(numberOfChoice, 10) <= choices.length);
	return (
		<div>
			<SearchBox
				value={searchTerm}
				className={size}
				placeholder="Search"
				onEscape={onSearchEscape}
				onClear={onSearchClear}
				onChange={onSearchChange}
				onSearch={onSearchRequest}
				onFocus={onSearchFocus}
				onBlur={onSearchBlur}
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
					<div>
						{data.content}
					</div>
				))}
			</div>
		</div>
	);
};

export default SearchField;
