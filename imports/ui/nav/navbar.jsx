import React, { Component } from "react";
import { withRouter } from "react-router-dom";
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

initializeIcons();

class Navbar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isSettingsOpen: false,
		};
		this.openModal = this.openModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
		this.onAdminNav = this.onAdminNav.bind(this);
		this.onEmployeeNav = this.onEmployeeNav.bind(this);
		this.onHomeNav = this.onHomeNav.bind(this);
		this.navToTasklist = this.navToTasklist.bind(this);
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

	navToTasklist(route) {
		this.props.history.push(`/tasklist?subscriptionId=${ route }`);
	}

	render() {
		return (
			<div>
				<Stack horizontal horizontalAlign="space-between">
					<Stack.Item>
						<CommandBar items={navItems(this.onHomeNav, this.onAdminNav, this.onEmployeeNav, this.navToTasklist)} />
					</Stack.Item>
					<Stack horizontal>
						<Stack.Item align="center">
							<SearchBox placeholder="Search" />
						</Stack.Item>
						<CommandBar items={userCommandBarItems("Temp Username", this.openModal)} />
					</Stack>
				</Stack>
				<Modal
					isOpen={this.state.isSettingsOpen}
					onDismiss={this.closeModal}
					isBlocking={false}
				>
					<Settings closeModal={this.closeModal} />
				</Modal>
			</div>
		);
	}
}

export default withRouter(({ history }) => (
	<Navbar history={history} />
));
