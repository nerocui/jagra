import React from "react";
import { connect } from "react-redux";
import EditableTextfield from "../input/editableTextfield.jsx";

class TaskDetail extends React.Component {
	constructor(props) {
		super(props);
		this.state = Object.assign({}, props);
	}

	render() {
		console.log("Detail rerender! Props is:");
		console.log(this.props.description);
		return (
			<div className="component--task__detail-container">
				{this.props._id
				? (
					<EditableTextfield value={this.props.description} />
				)
				: (
					<div>
						choose a task
					</div>
				)}
			</div>
		);
	}
}

function mapStateToProps(state) {
	return { ...state.taskDetailItem };
}

export default connect(mapStateToProps, null)(TaskDetail);
