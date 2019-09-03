import React from "react";
import { TagPicker } from "office-ui-fabric-react";
import style from "../../constant/style";

class Picker extends React.Component {
	constructor(props) {
		super(props);
		this.onResolveSuggestions = this.onResolveSuggestions.bind(this);
		this.onItemSelected = this.onItemSelected.bind(this);
	}

	onResolveSuggestions(filterText, tagList) {
		return filterText
			? this.props.items
				.filter(item => item.name.toLowerCase().indexOf(filterText.toLowerCase()) === 0)
			: [];
	}

	onItemSelected(item) {
		this.props.addItemSelected(item._id);
		return item;
	}

	getTextFromItem(employee) {
		return employee.name;
	}

	render() {
		return (
			<div>
				<TagPicker
					className={style.input}
					onResolveSuggestions={this.onResolveSuggestions}
					onItemSelected={this.onItemSelected}
					getTextFromItem={this.getTextFromItem}
					pickerSuggestionsProps={{
						suggestionsHeaderText: this.props.suggestionsHeaderText,
						noResultsFoundText: this.props.noResultsFoundText,
					}}
					itemLimit={this.props.itemLimit}
					inputProps={{
						// onBlur: () => console.log('onBlur called'),
						// onFocus: () => console.log('onFocus called'),
						placeholder: this.props.placeholder,
					}}
				/>
			</div>
		);
	}
}

export default Picker;
