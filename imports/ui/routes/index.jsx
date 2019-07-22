import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import PrivateRoute from "./PrivateRoute.jsx";
import TaskListRoute from "./TaskListRoute.jsx";
import EmployeeListRoute from "./EmployeeListRoute.jsx";
import Login from "../nav/login.jsx";
import EmployeeDashboard from "../employee/dashboard.jsx";
import AdminDashboard from "../admin/dashboard.jsx";
import Navbar from "../nav/navbar.jsx";
import TaskMasterDetailViewContainer from "../task/taskMasterDetailView.jsx";
import EmployeeMasterDetailViewContainer from "../employee/employeeMasterDetailView.jsx";
import rootReducer from "../../reducers/index";

const store = createStore(rootReducer);

const routes = (
	<Provider store={store}>
		<Router>
			<div>
				<Navbar />
				<Switch>
					<Route path="/" exact component={Login} />
					<PrivateRoute path="/admin" exact component={AdminDashboard} />
					<PrivateRoute path="/dashboard" exact component={EmployeeDashboard} />
					<TaskListRoute path="/tasklist" exact component={TaskMasterDetailViewContainer} />
					<EmployeeListRoute path="/employeelist" exact component={EmployeeMasterDetailViewContainer} />
				</Switch>
			</div>
		</Router>
	</Provider>
);

export default routes;
