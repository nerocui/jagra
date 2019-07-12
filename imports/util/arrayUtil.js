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
export const addAllToList = (arr, eles) => {
	let result,
		i;
	for (i = 0; i < eles.length; i++) {
		if (!arr.includes(eles[i])) {
			result = addToList(arr, eles[i]);
		}
	}
	return result;
};
export const removeAllFromList = (arr, eles) => {
	let result = [],
		i;
	for (i = 0; i < arr.length; i++) {
		if (!eles.includes(arr[i])) {
			result = addToList(result, arr[i]);
		}
	}
	return result;
};

export const convertToPickerItems = (items, key, name) => (items ? items.map(item => Object.assign({}, item, { key: item[key], name: item[name] })) : []);
