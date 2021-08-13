import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { withTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
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

const Routes = ({ user }) => {
	if (user) {
		return (
			<Provider store={store}>
				<Router>
					<Switch>
						<div>
							<Navbar />
							<Switch>
								<Route path="/" exact component={EmployeeDashboard} />
								<Route path="/reset" exact component={ResetPage} />
								<Route path="/admin" exact component={AdminDashboard} />
								<TaskListRoute path="/tasklist" exact component={TaskMasterDetailViewContainer} />
								<TaskDetailRoute path="/taskdetail" exact component={TaskDetailContainer} />
							</Switch>
						</div>
					</Switch>
					
				</Router>
			</Provider>
		);
	}
	return (
		<Provider store={store}>
			<Router>
				<Route path="/" exact component={Login} />
			</Router>
		</Provider>
	);
};

export default withTracker(() => ({
		user: Meteor.user(),
}))(Routes);
