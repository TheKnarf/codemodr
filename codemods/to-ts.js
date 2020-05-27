const runner = function* ({ matchFile, getSource, updateSource, renameSourceFileEnding }) {
	yield matchFile(/.jsx?$/i);

	const source = (yield getSource())
		.split("\n");

	if(!source[0].startsWith('// @ts-nocheck')) {
		source.splice(0, 0, '// @ts-nocheck');
	}

	yield updateSource(
		source.join("\n")
	);

	yield renameSourceFileEnding('.tsx');
}

module.exports = {
	default: runner
};
