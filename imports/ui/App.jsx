import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import AdminDashboard from "./admin/dashboard";
import EmployeeDashboard from "./employee/dashboard";
import Login from "./nav/login";
import Signup from "./nav/signup";

const routes = (
	<Router>
		<Route path="/" Component={Login} />
		<Route path="/signup" Component={Signup} />
		<Route path="/dashboard" Component={EmployeeDashboard} />
		<Route path="/admin" Component={AdminDashboard} />
	</Router>
);

export default routes;
