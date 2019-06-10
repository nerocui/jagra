import React, { Component } from "react";
import { Stack, IStackProps } from "office-ui-fabric-react/lib/Stack";
import { TextField, MaskedTextField } from "office-ui-fabric-react/lib/TextField";
import { css, classNamesFunction, IButtonProps, IStyle, PrimaryButton } from "office-ui-fabric-react";

export default class AdminDashboard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tab: "dashboard",
		};
	}

	render() {
		return (
			<Stack horizontal>
				<h1>{this.state.tab}</h1>
				<form>
					<Stack>
						<TextField label="Email" />
						<TextField label="Password" type="password" />
						<PrimaryButton ariaDescription="Button description for accessibility.">
							Create Account
						</PrimaryButton>
					</Stack>
				</form>

			</Stack>
		);
	}
}
