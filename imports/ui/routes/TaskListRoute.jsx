import React, { Component } from "react";
import queryString from "query-string";
import { Route, Redirect } from "react-router-dom";
import { isAuthenticated } from "../../util/authUtil";

export default class TaskListRoute extends Component {
	constructor(props) {
		super(props);
		this.renderRoute = this.renderRoute.bind(this);
	}

	renderRoute() {
		const COMPONENT = this.props.component;
		return (
			isAuthenticated() ?
			<COMPONENT 
				subscriptionId={queryString.parse(window.location.search).subscriptionId}
				taskId={queryString.parse(window.location.search).taskId}
			/>
			:
			<Redirect to="/" />
		);
	}

	render() {
		const { component, ...rest } = this.props;
		return (
			<Route {...rest} render={this.renderRoute} />
		);
	}
}
