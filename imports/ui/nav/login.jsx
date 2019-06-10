import React, { Component } from "react";
import { login } from "../../util/authUtil";

export default class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			err: "",
			email: "",
			password: "",
		};
		this.onSubmit = this.onSubmit.bind(this);
		this.setEmail = this.setEmail.bind(this);
		this.setPassword = this.setPassword.bind(this);
	}

	onSubmit() {
		login(this.state.email, this.state.password, () => {
			this.setState({ err: "You are logged in!" });
		});
	}

	setEmail(e) {
		this.setState({ email: e.target.value });
	}

	setPassword(e) {
		this.setState({ password: e.target.value });
	}

	render() {
		return (
			<div>
				{this.state.err}
				<h1>Login</h1>
				<form onSubmit={this.onSubmit}>
					<input value={this.state.email} onChange={this.setEmail} />
					<input value={this.state.password} onChange={this.setPassword} />
					<button type="submit">Login</button>
				</form>
			</div>
		);
	}
}
