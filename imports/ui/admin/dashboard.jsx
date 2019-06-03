import React, { Component } from "react";

export default class AdminDashboard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tab: "dashboard",
		};
	}

	render() {
		return (
			<div>
				<h1>{ this.state.tab }</h1>
				Admin dashboard
			</div>
		);
	}
}
