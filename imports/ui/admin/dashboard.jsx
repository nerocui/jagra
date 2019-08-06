import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import Signup from "../nav/signup.jsx";
import { signup } from "../../util/authUtil";
import { Employees } from "../../api/db";
import EmployeeList from "../employee/employeeItemList.jsx";
import style from "../../constant/style";
import EmployeeImporter from "./employeeImporter.jsx";


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
		this.reset = this.reset.bind(this);
	}


	onSubmit(e) {
		e.preventDefault();
		signup(this.state.email, this.state.firstName, this.state.lastName);
		this.reset();
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

	handleChange = (e, results) => {
		results.forEach(result => {
			const [e, file] = result;
			console.log(e.target.result);
			console.log(`Successfully uploaded ${file.name}!`);
		});
	}

	reset() {
		this.setState({
			email: "",
			firstName: "",
			lastName: "",
		});
	}

	handleFile(file) {
		console.log(file);
		const reader = new FileReader();
		reader.onload = evt => {
			console.log(evt.target.result);
		};
		reader.readAsText(file.path);
	}

	render() {
		return (
			<div className="component--dashboard">
				<h1>{this.state.tab}</h1>
				Admin Dashboard
				<h2>Signup</h2>
				<Signup
					onSubmit={this.onSubmit}
					onEmailChange={this.onEmailChange}
					onFirstnameChange={this.onFirstnameChange}
					onLastnameChange={this.onLastnameChange}
					emailValue={this.state.email}
					firstNameValue={this.state.firstName}
					lastNameValue={this.state.lastName}
				/>
				<EmployeeImporter
					handleChange={this.handleChange}
				/>
				<EmployeeList
					employees={this.props.employeeList}
					size={style.scrollablePane.normal}
				/>
			</div>
		);
	}
}

const AdminDashboardContainer = withTracker(() => {
	const employeeListHandle = Meteor.subscribe("allEmployees");
	const loading = !employeeListHandle.ready();
	return {
		loading,
		employeeList: Employees.find({}).fetch(),
	};
})(AdminDashboard);

export default AdminDashboardContainer;
