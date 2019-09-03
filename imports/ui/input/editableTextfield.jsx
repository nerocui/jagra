import React from "react";
import onClickOutside from "react-onclickoutside";
import { DefaultButton, PrimaryButton } from "office-ui-fabric-react";

class EditableTextfield extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			editing: false,
			editable: "",
		};
		this.renderTextblock = this.renderTextblock.bind(this);
		this.renderTextfield = this.renderTextfield.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.onCancel = this.onCancel.bind(this);
		this.onChange = this.onChange.bind(this);
		this.onEdit = this.onEdit.bind(this);
	}

	onSubmit(e) {
		e.preventDefault();
		this.setState({ editing: false });
		this.props.onValueSubmit(this.state.editable);
	}

	onCancel(e) {
		e.preventDefault();
		this.setState({ editing: false });
	}

	onChange(e) {
		e.preventDefault();
		this.setState({ editable: e.target.value });
	}

	onEdit() {
		this.setState({ editing: true, editable: this.props.value });
	}

	handleClickOutside(e) {
		if (this.state.editing) {
			this.onCancel(e);
		}
	}

	renderTextblock() {
		return (
			<div className="element--text__text-block">
				<p onClick={this.onEdit}>{this.props.value}</p>
			</div>
		);
	}

	renderTextfield() {
		return (
			<div className="element--text__textfield">
				<form onSubmit={this.onSubmit}>
					<input value={this.state.editable} onChange={this.onChange} autoFocus />
				</form>
				<form onSubmit={this.onSubmit} className="element--button__form">
					<PrimaryButton type="submit">Save</PrimaryButton>
					<DefaultButton type="button" onClick={this.onCancel}>Cancel</DefaultButton>
				</form>
			</div>
		);
	}

	render() {
		return (
			<div className="component--input__editable-textfield">
				{this.state.editing ? this.renderTextfield() : this.renderTextblock()}
			</div>
		);
	}
}

export default onClickOutside(EditableTextfield);
