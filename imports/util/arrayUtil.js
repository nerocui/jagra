import equals from "fast-deep-equal";
export const removeElement = (arr, ele) => {
    let result = [];
    arr.forEach(e => {
        if (!equals(e, ele)) {
            result = [e, ...result];
        }
    });
    return result;
};
export const removeBeginning = (arr) => {
    let result = [], i;
    for (i = 0; i < arr.length; i++) {
        if (i !== 0) {
            result = [arr[i], ...result];
        }
    }
    return result;
};
export const removeEnding = (arr) => {
    let result = [], i;
    for (i = 0; i < arr.length - 1; i++) {
        result = [arr[i], ...result];
    }
    return result;
};
export const addToList = (arr, ele) => {
    let result = [...arr, ele];
    return result;
};
