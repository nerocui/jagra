import React, { Component } from "react";
import { Accounts } from "meteor/accounts-base";
import { Session } from "meteor/session";

export default class ResetPage extends Component {
	constructor(props) {
		super(props);
		const urlParams = new URLSearchParams(window.location.search);
		this.state = {
			token: urlParams.get("token"),
			password: "",
		};
		this.onSubmit = this.onSubmit.bind(this);
		this.onPasswordChange = this.onPasswordChange.bind(this);
	}

	onPasswordChange(e) {
		this.setState({ password: e.target.value });
	}

	onSubmit(e) {
		e.preventDefault();
		Accounts.resetPassword(this.state.token, this.state.password);
		// eslint-disable-next-line meteor/no-session
		Session.set("enroll", true);
		this.setState({ password: "" });
	}

	render() {
		//call Accounts.resetPassword(token, newPassword, [callback])
		return (
			<div>
				<form onSubmit={this.onSubmit}>
					<h3>Please set a password</h3>
					<input onChange={this.onPasswordChange} value={this.state.password} />
				</form>
			</div>
		);
	}
}
