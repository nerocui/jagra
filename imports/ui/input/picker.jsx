import React from "react";
import { TagPicker } from "office-ui-fabric-react";
import style from "../../constant/style";

class Picker extends React.Component {
	constructor(props) {
		super(props);
		this.onResolveSuggestions = this.onResolveSuggestions.bind(this);
	}

	onResolveSuggestions(filterText, tagList) {
		console.log(this.props);
		return filterText
      ? this.props.items
          .filter(tag => tag.firstName.toLowerCase().indexOf(filterText.toLowerCase()) === 0)
      : [];
	}

	onItemSelected(item) {
		console.log(item);
		return item;
	}

	getTextFromItem(employee) {
		console.log("getting text");
		console.log(employee.firstName);

		return employee.firstName;
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
						suggestionsHeaderText: "Suggested Employees",
						noResultsFoundText: "No Matching Employee Found",
					}}
					itemLimit={this.props.itemLimit}
					inputProps={{
						// onBlur: () => console.log('onBlur called'),
						// onFocus: () => console.log('onFocus called'),
						placeholder: "Pick an assignee.",
					}}
				/>
			</div>
		);
	}
}

export default Picker;
