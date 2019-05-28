import React, { Component } from "react";

export default class Login extends Component {
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
				<h1>Login</h1>
			</div>
		);
	}
}
