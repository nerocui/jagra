import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import { isAuthenticated } from "../../util/authUtil";

export default class PrivateRoute extends Component {
	constructor(props) {
		super(props);
		this.state = {
			component: props.component,
		};
		this.renderRoute = this.renderRoute.bind(this);
	}

	renderRoute() {
		const COMPONENT = this.state.component;
		return (
			isAuthenticated() ? <COMPONENT /> : <Redirect to="/login" />
		);
	}

	render() {
		const { component, ...rest } = this.props;
		return (
			<Route {...rest} render={this.renderRoute} />
		);
	}
}
