import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

const EmployeeImporter = () => {
	const onDrop = useCallback(acceptedFiles => {
		console.log(acceptedFiles);
	}, []);
	const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
	return (
		<div {...getRootProps({className: "component--admin__import"})}>
			<input {...getInputProps()} />
			{
				isDragActive ?
				<p>Drop the files here ...</p> :
				<p>Drag 'n' drop some files here, or click to select files</p>
			}
		</div>
	);
};

export default EmployeeImporter;
