const { fixClassName } = require('./helpers/className.js');

export default function transformer(file, api) {
	if(!/\.css$/.test(file.path)) {
		return;
	}

	const { source } = file;
	return source.replace(/\.[^ /(:;]+/gi, fixClassName);
}
