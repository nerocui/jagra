import React, { Component } from "react";
import queryString from "query-string";
import PrivateRoute from "./PrivateRoute.jsx";

export default class TaskListRoute extends Component {
	constructor(props) {
		super(props);
		this.renderRoute = this.renderRoute.bind(this);
	}

	renderRoute() {
		const COMPONENT = this.props.component;
		console.log(`Passing subscription ${ queryString(window.location.search).subscriptionId }`)
		return (
			<COMPONENT subscriptionId={queryString(window.location.search).subscriptionId} />
		);
	}

	render() {
		const { component, ...rest } = this.props;
		return (
			<PrivateRoute {...rest} render={this.renderRoute} />
		);
	}
}
