import React, { Component } from "react";

export default class EmployeeDashboard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			err: "",
		};
	}

	render() {
		return (
			<div>
				{this.state.err}
				<h1>EmployeeDashboard</h1>
			</div>
		);
	}
}
