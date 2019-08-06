import JsonValidator from "json-validator";

export function handleChange(files, onChange, as) {
	const readAs = (as || "url").toLowerCase();

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

export function validateFile(file, content, format, template) {
	if (!file.name || !file.name.endsWith(format)) {
		return false;
	}
	const obj = JSON.parse(content);
	return JsonValidator.validate(obj, template, (err, message) => {
		if (err) {
			console.log(err);
			return;
		}
		console.log(message);
	});
}
