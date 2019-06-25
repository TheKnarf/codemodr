const { fixClassName } = require('./helpers/className.js');

export default function transformer(file, api) {
	const { source } = file;

	//console.log(file);
	return source.replace(/\.[^ /(:;]+/gi, fixClassName);
}
