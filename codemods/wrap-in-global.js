const runner = function* ({ matchFile, getSource, updateSource, renameSourceFileEnding }) {
	yield matchFile(/.scss$/i);
	yield matchFile(/.module.scss$/i, false);

	const source = (yield getSource())
		.split("\n");

	for(let i=0; i < source.length; i++) {
		if(!source[i].startsWith('@import')) {
			if(!source[i].startsWith(':global {')) {
				source.splice(i, 0, ":global {");
				source.push("}");
			}
			break;
		}
	}

	yield updateSource(
		source.join("\n")
	);

	yield renameSourceFileEnding('.module.scss');
}

module.exports = {
	default: runner
};
