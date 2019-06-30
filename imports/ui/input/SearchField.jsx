import React from "react";
import { SearchBox } from "office-ui-fabric-react";
import CLICK_MODE from "../../constant/actions/searchMode";
import SuggestionBox from "./suggestionBox.jsx";

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
	onSearchBlur,
}) => {
	const _searchDomain = [...searchDomain];
	const _choices = [...choices].slice(0, numberOfChoice);
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
				onBlur={onSearchBlur}
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
			<SuggestionBox dataPool={dataPool} />
		</div>
	);
};

export default SearchField;
