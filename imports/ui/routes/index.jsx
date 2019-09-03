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
import TaskDetailContainer from "../task/taskDetailContainer.jsx";
import rootReducer from "../../reducers/index";
import ResetPage from "../nav/reset.jsx";

const store = createStore(rootReducer);

const routes = (
	<Provider store={store}>
		<Router>
			<div>
				<Navbar />
				<Switch>
					<Route path="/" exact component={Login} />
					<Route path="/reset" exact component={ResetPage} />
					<PrivateRoute path="/admin" exact component={AdminDashboard} />
					<PrivateRoute path="/dashboard" exact component={EmployeeDashboard} />
					<TaskListRoute path="/tasklist" exact component={TaskMasterDetailViewContainer} />
					<TaskDetailRoute path="/taskdetail" exact component={TaskDetailContainer} />
				</Switch>
			</div>
		</Router>
	</Provider>
);

export default routes;
