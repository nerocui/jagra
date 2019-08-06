import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

const MyDropzone = ({
	handleChange, onChange, as, wrapperStyle, activeText, inActiveText,
}) => {
  const onDrop = useCallback(acceptedFiles => {
    handleChange(acceptedFiles, onChange, as);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps({ className: wrapperStyle })}>
		<input {...getInputProps()} />
		<p className="element--dropzone__text">
			{isDragActive ? activeText : inActiveText}
		</p>
    </div>
  );
};

export default MyDropzone;
