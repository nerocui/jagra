import React from "react";
import { TextField } from "office-ui-fabric-react";

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
					<div onClick={() => this.setState({ edit: !this.state.edit })}>
						{this.state.edit ? 
						<TextField value={this.props._id} className="inpue--task-detail__editable-text" />
						:
						<div>
							{this.props._id}
						</div>
						}
					</div>
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
