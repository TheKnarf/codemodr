const js = require('./css-module-js.js').default;
const css = require('./css-module-css.js').default;

export default function transformer(file, api) {
	const updatedSource = js(file, api);
	if(typeof updatedSource == 'undefined' || updatedSource == null) {
		return css(file, api);
	}

	return updatedSource;
}

export const parser = 'tsx';
