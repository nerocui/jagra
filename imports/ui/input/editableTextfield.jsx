import React from "react";

class EditableTextfield extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			editing: false,
			edited: false,
			value: this.props.value,
		};
		console.log("Editable Textfield rerendered");
		this.renderTextblock = this.renderTextblock.bind(this);
		this.renderTextfield = this.renderTextfield.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.onCancel = this.onCancel.bind(this);
		this.onChange = this.onChange.bind(this);
	}

	onSubmit(e) {
		e.preventDefault();
		this.setState({ editing: false });
	}

	onCancel(e) {
		e.preventDefault();
		if (this.state.edited) {
			this.setState({ editing: false, edited: false, value: this.props.value });
		} else {
			this.setState({ editing: false });
		}
	}

	onChange(e) {
		this.setState({ value: e.target.value, edited: true });
	}

	renderTextblock() {
		return (
			<p onClick={() => this.setState({ editing: true })}>{this.props.value}</p>
		);
	}

	renderTextfield() {
		return (
			<div>
				<input value={this.props.value} onChange={this.onChange} />
				<form onSubmit={this.onSubmit}>
					<button type="submit">Save</button>
					<button type="button" onClick={this.onCancel}>Cancel</button>
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
