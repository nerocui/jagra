import React from "react";
import {
 Stack, DefaultButton, PrimaryButton, CommandBarButton,
} from "office-ui-fabric-react";

const Settings = ({ closeModal }) => (
	<div className="component--setting__container">
		<Stack verticalAlign="space-between" className="component--setting__content">
			<Stack.Item>
				<Stack horizontal horizontalAlign="space-between">
					<h2>Settings</h2>
					<CommandBarButton iconProps={{ iconName: "ChromeClose" }} onClick={closeModal} />
				</Stack>
			</Stack.Item>
			<Stack.Item>
				<Stack
					horizontal
					wrap
					horizontalAlign="end"
					tokens={{ childrenGap: "20" }}
				>
					<DefaultButton>Cancel</DefaultButton>
					<PrimaryButton>Apply</PrimaryButton>
					<PrimaryButton>OK</PrimaryButton>
				</Stack>
			</Stack.Item>
		</Stack>
	</div>
);

export default Settings;
