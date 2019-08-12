const parse_name = input_name => {
	const [ _, path, name, ending ] = input_name.match(/(.*)\/(.*)\.(tsx|jsx|js|ts)$/i);
	return { path, name, ending };
};

const runner = function* ({ matchFile, fileExists, newFile }) {
	const filename = yield matchFile(/\.(ts|js)x?$/i);
	yield matchFile(/\.stories\.(ts|js)x?/i, false);

	const { path, name, ending } = parse_name(filename),
			story_filename = `./${path}/${name}.stories.${ending}`;

	if(yield fileExists(story_filename))
		return;

	// TODO: check source to find list of exports
	//const source = yield getSource();
	
	const story_source = `import React from 'react';
import ${name} from './${name}';

export default { title: '${name}' };

export const Empty = () => <> Empty </>;
`;

	yield newFile(story_filename, story_source);
}

module.exports = {
	default: runner
};
