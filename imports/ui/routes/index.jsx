import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import PrivateRoute from "./PrivateRoute.jsx";
import Login from "../nav/login.jsx";
import EmployeeDashboard from "../employee/dashboard.jsx";
import AdminDashboard from "../admin/dashboard.jsx";
import Navbar from "../nav/navbar.jsx";

const routes = (
	<Router>
		<div>
			<Navbar />
			<Switch>
				<Route path="/" exact component={Login} />
				<PrivateRoute path="/admin" exact component={AdminDashboard} />
				<PrivateRoute path="/dashboard" exact component={EmployeeDashboard} />
			</Switch>
		</div>
	</Router>
);

export default routes;