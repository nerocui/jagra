import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../actions/index";

class SuggestionBoxItem extends Component {
	constructor(props) {
		super(props);
		this.onClick = this.onClick.bind(this);
	}
	
	onClick() {
		console.log('clicked');
		this.props.onNewTaskSearchItemClick(this.props.data);
	}

	render() {
		return (
			<div onClick={this.onClick} role="button" tabIndex="1">
				{this.props.data.title}
			</div>
		);
	}
}

const mapDispatchToProps = dispatch => ({
	onNewTaskSearchItemClick: item => {
		dispatch(actions.onNewTaskSearchItemClick(item));
	},
});

const SuggestionBoxItemContainer = connect(null, mapDispatchToProps)(SuggestionBoxItem);

const SuggestionBox = ({ dataPool }) => {
		const _datapool = [...dataPool];
		return (
			<div className="component--inpit__search-suggestion">
				{_datapool.map(data => (
					<SuggestionBoxItemContainer key={data._id} data={data} />
				))}
			</div>
		);
};

export default SuggestionBox;
