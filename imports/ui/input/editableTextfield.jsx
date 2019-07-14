import React from "react";

class EditableTextfield extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			editing: false,
		};
		this.renderTextblock = this.renderTextblock.bind(this);
		this.renderTextfield = this.renderTextfield.bind(this);
	}

	toggleEdit() {
		this.setState({ editing: !this.state.editing });
	}

	renderTextblock() {
		return (
			<p>{this.props.value}</p>
		);
	}

	renderTextfield() {
		return (
			<input value={this.props.value} />
		);
	}

	render() {
		return (
			<div onClick={this.toggleEdit}>
				{this.state.editing ? this.renderTextfield() : this.renderTextblock()}
			</div>
		);
	}
}

export default EditableTextfield;
