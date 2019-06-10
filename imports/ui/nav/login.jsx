import React, { Component } from "react";
import { Meteor } from "meteor/meteor";

export default class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			err: "",
			username: "",
			password: "",
		};
		this.onSubmit = this.onSubmit.bind(this);
		this.setUsername = this.setUsername.bind(this);
		this.setPassword = this.setPassword.bind(this);
	}

	onSubmit(e) {
		e.preventDefault();
		Meteor.loginWithPassword({ username: this.state.username }, this.state.password, err => {
			console.log(err);
			this.setState({ err });
		});
		console.log("[Current User: ]", Meteor.userId());
		this.setState({ username: "", password: "" });
	}

	setUsername(e) {
		this.setState({ username: e.target.value });
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
					<input value={this.state.username} onChange={this.setUsername} />
					<input value={this.state.password} onChange={this.setPassword} type="password" />
					<button type="submit">Login</button>
				</form>
			</div>
		);
	}
}
