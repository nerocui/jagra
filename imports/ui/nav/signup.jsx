import React, { Component } from "react";

export default class Signup extends Component {
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
				<h1>Signup</h1>
			</div>
		);
	}
}
