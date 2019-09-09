import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import { isAuthenticated } from "../../util/authUtil";

export default class PublicRoute extends Component {
	constructor(props) {
		super(props);
		this.renderRoute = this.renderRoute.bind(this);
	}

	renderRoute() {
		const COMPONENT = this.props.component;
		return (
			isAuthenticated() ? <Redirect to="/dashboard" /> : <COMPONENT />
		);
	}

	render() {
		const { component, ...rest } = this.props;
		return (
			<Route {...rest} render={this.renderRoute} />
		);
	}
}
