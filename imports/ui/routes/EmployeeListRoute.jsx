import React, { Component } from "react";
import queryString from "query-string";
import { Route, Redirect } from "react-router-dom";
import { isAuthenticated, isAdmin } from "../../util/authUtil";

export default class EmployeeListRoute extends Component {
	constructor(props) {
		super(props);
		this.renderRoute = this.renderRoute.bind(this);
	}

	renderRoute() {
		const COMPONENT = this.props.component;
		return (
			isAuthenticated() && isAdmin() ? (
				<COMPONENT
					employeeID={queryString.parse(window.location.search).employeeID}
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
