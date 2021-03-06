import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import {
	CommandBar,
	initializeIcons,
	Stack,
	SearchBox,
	Modal,
} from "office-ui-fabric-react";
import navItems from "../../config/uiConfig/navbar";
import userCommandBarItems from "../../config/uiConfig/navbar/userTab";
import Settings from "../settings/index.jsx";
import NewTaskCreator from "../task/taskCreate.jsx";

initializeIcons();

class Navbar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isSettingsOpen: false,
			isNewTaskCreatorOpen: false,
		};
		this.openModal = this.openModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
		this.openNewTask = this.openNewTask.bind(this);
		this.closeNewTask = this.closeNewTask.bind(this);
		this.onAdminNav = this.onAdminNav.bind(this);
		this.onEmployeeNav = this.onEmployeeNav.bind(this);
		this.onHomeNav = this.onHomeNav.bind(this);
		this.navToTasklist = this.navToTasklist.bind(this);
		this.handleLogout = this.handleLogout.bind(this);
	}

	onAdminNav() {
		this.props.history.push("/admin");
	}

	onEmployeeNav() {
		this.props.history.push("/dashboard");
	}

	onHomeNav() {
		this.props.history.push("/");
	}

	openModal() {
		this.setState({ isSettingsOpen: true });
	}

	closeModal() {
		this.setState({ isSettingsOpen: false });
	}

	openNewTask() {
		this.setState({ isNewTaskCreatorOpen: true });
	}

	closeNewTask() {
		this.setState({ isNewTaskCreatorOpen: false });
	}

	navToTasklist(route) {
		this.props.history.push(`/tasklist?subscriptionId=${ route }`);
	}

	handleLogout() {
		Accounts.logout();
		this.props.history.push("/");
	}

	render() {
		return (
			<div className="component--nav__navbar-container">
				<Stack horizontal horizontalAlign="space-between">
					<Stack.Item>
						<CommandBar items={navItems(this.onHomeNav, this.onAdminNav, this.onEmployeeNav, this.navToTasklist, this.openNewTask)} />
					</Stack.Item>
					<Stack horizontal>
						<Stack.Item align="center">
							<SearchBox placeholder="Search" />
						</Stack.Item>
						<CommandBar items={userCommandBarItems(this.props.username, this.openModal, this.handleLogout)} />
					</Stack>
				</Stack>
				<Modal
					isOpen={this.state.isSettingsOpen}
					onDismiss={this.closeModal}
					isBlocking={false}
				>
					<Settings closeModal={this.closeModal} />
				</Modal>
				<Modal
					isOpen={this.state.isNewTaskCreatorOpen}
					onDismiss={this.closeNewTask}
					isBlocking={false}
				>
					<NewTaskCreator />
				</Modal>
			</div>
		);
	}
}
const NavbarContainer = withTracker(() => ({
		username: Meteor.user() && Meteor.user().username,
}))(Navbar);

export default withRouter(({ history }) => (
	<NavbarContainer history={history} />
));
