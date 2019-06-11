import React from "react";
import { Stack, TextField, PrimaryButton } from "office-ui-fabric-react";

const Signup = ({
	onSubmit,
	onEmailChange,
	onUsernameChange,
	onFirstnameChange,
	onLastnameChange,
	onPasswordChange,
}) => {
	return (
		<Stack horizontal>
			<Stack>
				Create Employee Account
				<form onSubmit={onSubmit}>
					<TextField placeholder="Email" onChange={onEmailChange} />
					<TextField placeholder="User Name" onChange={onUsernameChange} />
					<TextField placeholder="First Name" onChange={onFirstnameChange} />
					<TextField placeholder="Last Name" onChange={onLastnameChange} />
					<TextField placeholder="Password" type="password" onChange={onPasswordChange} />
					<PrimaryButton type="submit">Create</PrimaryButton>
				</form>
			</Stack>
			<div className="center-both">
				Bulk import employees
			</div>
		</Stack>
		
	);
};

export default Signup;
