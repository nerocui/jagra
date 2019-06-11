import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import Signup from "../nav/signup.jsx";
import { signup } from "../../util/authUtil";
import EmployeeList from "../employee/employeeList.jsx";
import { Employees } from "../../api/db";

class AdminDashboard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tab: "dashboard",
			email: "",
			userName: "",
			firstName: "",
			lastName: "",
			password: "",
		};
		this.onSubmit = this.onSubmit.bind(this);
		this.onEmailChange = this.onEmailChange.bind(this);
		this.onUsernameChange = this.onUsernameChange.bind(this);
		this.onFirstnameChange = this.onFirstnameChange.bind(this);
		this.onLastnameChange = this.onLastnameChange.bind(this);
		this.onPasswordChange = this.onPasswordChange.bind(this);
	}

	onSubmit(e) {
		e.preventDefault();
		console.log("hello");
		signup(this.state.email, this.state.password, this.state.firstName, this.state.lastName);
	}

	onEmailChange(e) {
		this.setState({ email: e.target.value.trim() });
	}

	onUsernameChange(e) {
		this.setState({ userName: e.target.value.trim() });
	}

	onFirstnameChange(e) {
		this.setState({ firstName: e.target.value.trim() });
	}

	onLastnameChange(e) {
		this.setState({ lastName: e.target.value.trim() });
	}

	onPasswordChange(e) {
		this.setState({ password: e.target.value.trim() });
	}

	render() {
		return (
			<div>
				<h1>{this.state.tab}</h1>
				Admin Dashboard
				<h2>Signup</h2>
				<Signup
					onSubmit={this.onSubmit}
					onEmailChange={this.onEmailChange}
					onUsernameChange={this.onUsernameChange}
					onFirstnameChange={this.onFirstnameChange}
					onLastnameChange={this.onLastnameChange}
					onPasswordChange={this.onPasswordChange}
  				/>
				<EmployeeList employees={this.props.employeeList} />
			</div>
		);
	}
}

const AdminDashboardContainer = withTracker(() => {
	const employeeListHandle = Meteor.subscribe("employees");
	const loading = !employeeListHandle.ready();
	return {
		loading,
		employeeList: Employees.find({}).fetch(),
	};
})(AdminDashboard);

export default AdminDashboardContainer;
