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

	renderTextblock() {
		return (
			<p onClick={() => this.setState({ editing: true })}>{this.props.value}</p>
		);
	}

	renderTextfield() {
		return (
			<div>
				<input value={this.props.value} onClick={() => this.setState({ editing: false })} />
				<form onSubmit={this.onSubmit}>
					<button type="submit">Save</button>
					<button type="button">Cancel</button>
				</form>
			</div>
		);
	}

	render() {
		return (
			<div>
				{this.state.editing ? this.renderTextfield() : this.renderTextblock()}
			</div>
		);
	}
}

export default EditableTextfield;
