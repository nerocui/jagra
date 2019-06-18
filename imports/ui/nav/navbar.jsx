/* eslint-disable react/jsx-indent-props */
import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import {
	CommandBar,
	initializeIcons,
	Stack,
	SearchBox,
	Modal,
} from "office-ui-fabric-react";
import { navItems, userCommandBarItems } from "../../config/uiConfig/navConfig";

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
	}

	onAdminNav() {
		this.props.history.push("/admin");
	}

	onEmployeeNav() {
		this.props.history.push("/dashboard");
	}

	openModal() {
		this.setState({ isSettingsOpen: true });
	}

	closeModal() {
		this.setState({ isSettingsOpen: false });
	}


	render() {
		return (
			<div>
				<Stack horizontal horizontalAlign="space-between">
					<Stack.Item>
						<CommandBar items={navItems(this.onAdminNav, this.onEmployeeNav)} />
					</Stack.Item>
					<Stack horizontal>
						<Stack.Item align="center">
							<SearchBox placeholder="Search" />
						</Stack.Item>
						<Stack.Item>
							<CommandBar items={userCommandBarItems("Temp Username", this.openModal)} />
						</Stack.Item>
					</Stack>
					
				</Stack>
				<Modal
					isOpen={this.state.isSettingsOpen}
					onDismiss={this.closeModal}
					isBlocking={false}
				>
						Settings
				</Modal>
			</div>
		);
	}
}

export default withRouter(({ history }) => (
	<Navbar history={history} />
));
