import equals from "fast-deep-equal";

export const removeElement = (arr, ele) => {
	let result = [];
	arr.forEach(e => {
		if (!equals(e, ele)) {
			result = [...result, e];
		}
	});
	return result;
};
export const removeBeginning = arr => {
	let result = [],
		i;
	for (i = 0; i < arr.length; i++) {
		if (i !== 0) {
			result = [...result, arr[i]];
		}
	}
	return result;
};
export const removeEnding = arr => {
	let result = [],
		i;
	for (i = 0; i < arr.length - 1; i++) {
		result = [...result, arr[i]];
	}
	return result;
};
export const addToList = (arr, ele) => {
	const result = [...arr, ele];
	return result;
};
