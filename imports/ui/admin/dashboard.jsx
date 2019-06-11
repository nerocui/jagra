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
			firstName: "",
			lastName: "",
		};
		this.onSubmit = this.onSubmit.bind(this);
		this.onEmailChange = this.onEmailChange.bind(this);
		this.onFirstnameChange = this.onFirstnameChange.bind(this);
		this.onLastnameChange = this.onLastnameChange.bind(this);
	}

	onSubmit(e) {
		e.preventDefault();
		console.log("hello");
		signup(this.state.email, this.state.firstName, this.state.lastName);
	}

	onEmailChange(e) {
		this.setState({ email: e.target.value.trim() });
	}

	onFirstnameChange(e) {
		this.setState({ firstName: e.target.value.trim() });
	}

	onLastnameChange(e) {
		this.setState({ lastName: e.target.value.trim() });
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
  onFirstnameChange={this.onFirstnameChange}
  onLastnameChange={this.onLastnameChange}
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
