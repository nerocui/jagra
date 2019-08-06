import React from "react";
import FileReaderInput from "react-file-reader-input";
import { DefaultButton } from "office-ui-fabric-react";

const EmployeeImporter = ({ handleChange }) => (
	<FileReaderInput
		as="binary"
		id="my-file-input"
		onChange={handleChange}
	>
		<DefaultButton
			text="Bulk Import"
		/>
	</FileReaderInput>
);

export default EmployeeImporter;
