import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import PrivateRoute from "./PrivateRoute.jsx";
import TaskListRoute from "./TaskListRoute.jsx";
import TaskDetailRoute from "./TaskDetailRoute.jsx";
import Login from "../nav/login.jsx";
import EmployeeDashboard from "../employee/dashboard.jsx";
import AdminDashboard from "../admin/dashboard.jsx";
import Navbar from "../nav/navbar.jsx";
import TaskMasterDetailViewContainer from "../task/taskMasterDetailView.jsx";
import { TaskDetailContainerWithTracker } from "../task/taskDetail.jsx";
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
					<TaskDetailRoute path="/taskdetail" exact component={TaskDetailContainerWithTracker} />
				</Switch>
			</div>
		</Router>
	</Provider>
);

export default routes;
