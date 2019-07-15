import React from "react";
import onClickOutside from "react-onclickoutside";
import { connect } from "react-redux";
import * as actions from "../../actions/index";

class EditableTextfield extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			editing: false,
			edited: false,
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
		this.setState({ editing: false, edited: false });
		this.props.setEditingStatusKey(null);
		this.props.onValueSubmit(this.state.editable);
	}

	onCancel(e) {
		e.preventDefault();
		if (this.state.edited) {
			this.setState({ editing: false, edited: false });
		} else {
			this.setState({ editing: false });
		}
		this.props.resetEditorStatus();
	}

	onChange(e) {
		e.preventDefault();
		this.setState({ edited: true, editable: e.target.value });
		const data = {
			key: this.props.editorKey,
			value: e.target.value,
		};
		this.props.setEditingKeyValuePair(data);
	}

	onEdit() {
		this.setState({ editing: true, editable: this.props.value });
		this.props.setEditingStatusKey(this.props.editorKey);
	}

	handleClickOutside(e) {
		if (this.state.editing) {
			this.onCancel(e);
		}
	}

	renderTextblock() {
		return (
			<p onClick={this.onEdit}>{this.props.value}</p>
		);
	}

	renderTextfield() {
		return (
			<div>
				<input value={this.state.editable} onChange={this.onChange} />
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

function mapDispatchToProps(dispatch) {
	return {
		setEditingStatusKey: editorKey => dispatch(actions.setEditingStatusKey(editorKey)),
		setEditingKeyValuePair: data => dispatch(actions.setEditingKeyValuePair(data)),
		resetEditorStatus: () => dispatch(actions.resetEditorStatus()),
	};
}

const OutSideClickableEditableTextfield = onClickOutside(EditableTextfield);

export default connect(null, mapDispatchToProps)(OutSideClickableEditableTextfield);
