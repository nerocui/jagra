import React from "react";
import { TextField } from "office-ui-fabric-react";
import EditableTextfield from "../input/editableTextfield.jsx";

class TaskDetail extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			edit: false,
		};
	}

	render() {
		return (
			<div className="component--task__detail-container">
				{this.props._id
				? (
					<EditableTextfield value={this.props._id} />
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

export default TaskDetail;
