import React, { Component } from "react";

export default class ResetPage extends Component {
	constructor(props) {
		super(props);
		const urlParams = new URLSearchParams(window.location.search);
		this.state = {
			token: urlParams.get("token"),
		};
	}

	render() {
		//call Accounts.resetPassword(token, newPassword, [callback])
		return (
			<div>
				{this.state.token}
			</div>
		);
	}
}
