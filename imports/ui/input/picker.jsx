import React from "react";
import { TagPicker } from "office-ui-fabric-react";
import style from "../../constant/style";

const Picker = ({
	itemLimit,
	onResolveSuggestions,
	onItemSelected,
	getTextFromItem,
}) => (
	<TagPicker
		className={style.input}
		onRemoveSuggestion={onResolveSuggestions}
		onItemSelected={onItemSelected}
		getTextFromItem={getTextFromItem}
		pickerSuggestionsProps={{
            suggestionsHeaderText: "Suggested Tags",
            noResultsFoundText: "No Color Tags Found",
		}}
		itemLimit={itemLimit}
		inputProps={{
            // onBlur: () => console.log('onBlur called'),
            // onFocus: () => console.log('onFocus called'),
            placeholder: "Picker an assignee.",
		}}
	/>
);

export default Picker;
