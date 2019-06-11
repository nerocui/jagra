import React from "react";
import { Stack, TextField, PrimaryButton } from "office-ui-fabric-react";

const Signup = ({
	onSubmit,
	onEmailChange,
	onFirstnameChange,
	onLastnameChange,
}) => (
		<Stack horizontal>
			<Stack>
				Create Employee Account
				<form onSubmit={onSubmit}>
					<TextField placeholder="Email" onChange={onEmailChange} />
					<TextField placeholder="First Name" onChange={onFirstnameChange} />
					<TextField placeholder="Last Name" onChange={onLastnameChange} />
					<PrimaryButton type="submit">Create</PrimaryButton>
				</form>
			</Stack>
			<div className="center-both">
				Bulk import employees
			</div>
		</Stack>
		
	);

export default Signup;
