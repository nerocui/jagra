import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import AdminDashboard from "./admin/dashboard.jsx";
import EmployeeDashboard from "./employee/dashboard.jsx";
import Login from "./nav/login.jsx";

const routes = (
	<Router>
		<Route exact path="/" component={Login} />
		<Route exact path="/dashboard" component={EmployeeDashboard} />
		<Route exact path="/admin" component={AdminDashboard} />
	</Router>
);

export default routes;
