import React from "react";
import { Stack, TextField, PrimaryButton } from "office-ui-fabric-react";

const Signup = ({
	onSubmit,
	onEmailChange,
	onFirstnameChange,
	onLastnameChange,
	emailValue,
	firstNameValue,
	lastNameValue,
}) => (
		<Stack horizontal>
			<Stack>
				Create Employee Account
				<form onSubmit={onSubmit}>
					<TextField placeholder="Email" onChange={onEmailChange} value={emailValue} />
					<TextField placeholder="First Name" onChange={onFirstnameChange} value={firstNameValue} />
					<TextField placeholder="Last Name" onChange={onLastnameChange} value={lastNameValue} />
					<PrimaryButton type="submit">Create</PrimaryButton>
				</form>
			</Stack>
		</Stack>
		
	);

export default Signup;
