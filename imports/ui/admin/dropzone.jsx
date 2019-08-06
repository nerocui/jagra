import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

const MyDropzone = ({
	handleChange, onChange, as, wrapperStyle,
}) => {
  const onDrop = useCallback(acceptedFiles => {
    handleChange(acceptedFiles, onChange, as);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps({ className: wrapperStyle })}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drag 'n' drop some files here, or click to select files</p>
      }
    </div>
  );
};

export default MyDropzone;
