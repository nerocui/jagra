import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

function onChange(results) {
	results.forEach(result => {
		const [e, file] = result;
		console.log(e.target.result);
		console.log(`Successfully uploaded ${ file.name }!`);
	});
}

function handleChange(files) {
    const readAs = "binary";

    // Build Promise List, each promise resolved by FileReader.onload.
    Promise.all(files.map(file => new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = result => {
        // Resolve both the FileReader result and its original file.
        resolve([result, file]);
      };

      // Read the file with format based on this.props.as.
      switch (readAs) {
        case "binary": {
          (reader).readAsBinaryString(file);
          break;
        }
        case "buffer": {
          reader.readAsArrayBuffer(file);
          break;
        }
        case "text": {
          reader.readAsText(file);
          break;
        }
        case "url": {
          reader.readAsDataURL(file);
          break;
		}
		default: {
			reader.readAsDataURL(file);
          break;
		}
      }
    })))
    .then(zippedResults => {
      // Run the callback after all files have been read.
      onChange(zippedResults);
    });
}

function MyDropzone() {
  const onDrop = useCallback(acceptedFiles => {
    handleChange(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drag 'n' drop some files here, or click to select files</p>
      }
    </div>
  );
}

export default MyDropzone;
