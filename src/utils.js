
const getArraysEquality = (a, b) => a.length === b.length && a.every((v, i) => v === b[i]);
const getStringsEquality = (a, b) => a.toLowerCase() === b.toLowerCase();

export {getArraysEquality, getStringsEquality};