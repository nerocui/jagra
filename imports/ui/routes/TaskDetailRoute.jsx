import React, { Component } from "react";
import queryString from "query-string";
import { Route, Redirect } from "react-router-dom";
import { isAuthenticated } from "../../util/authUtil";

export default class TaskDetailRoute extends Component {
	constructor(props) {
		super(props);
		this.renderRoute = this.renderRoute.bind(this);
	}

	renderRoute() {
		const COMPONENT = this.props.component;
		console.log("Parsing:", queryString.parse(window.location.search).taskId);
		return (
			isAuthenticated() ? (
			<COMPONENT
				taskId={queryString.parse(window.location.search).taskId}
			/>
			) : <Redirect to="/" />
		);
	}

	render() {
		const { component, ...rest } = this.props;
		return (
			<Route {...rest} render={this.renderRoute} />
		);
	}
}
