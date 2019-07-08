const runner = function* ({ matchFile, getFile, getSource, updateSource }) {
	yield matchFile(/^readme.md$/i);

	const source = yield getSource();
	const { name } = JSON.parse(
		yield getFile('./package.json')
	);

	const npmVersion = `[![NpmVersion](https://img.shields.io/npm/v/${name}.svg)](https://www.npmjs.com/package/${name})`;

	if(source.indexOf(npmVersion) === -1) {
		const sourceByNewlines = source.split("\n");
		sourceByNewlines.splice(2, 0, npmVersion);
		const newSource = sourceByNewlines.join("\n");

		yield updateSource(newSource);
	}
}

module.exports = {
	default: runner
};
