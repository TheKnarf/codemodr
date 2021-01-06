const fixNaming = name =>
	name	
    .replace(
		 /\-+./gi,
		 x => x.substring(x.length-1).toUpperCase()
	 )
	.replace(
		 /\.+./gi,
		 x => x.substring(x.length-1).toUpperCase()
	 );

const parse_name = input_name => {
	const [ _, path, name, ending ] = input_name.match(/(.*)\/(.*)\.(tsx|jsx|js|ts)$/i);
	return { path, name, ending };
};

const roots_to_trim = [
	'src/',
];

const trim_roots = (roots_to_trim, path) => {
	for (var i in roots_to_trim) {
		if(path.startsWith(roots_to_trim[i])) {
			return path.substr(roots_to_trim[i].length);
		}
	}
	return path;	
};

const runner = function* ({ matchFile, fileExists, newFile }) {
	const filename = yield matchFile(/\.(ts|js)x?$/i);
	yield matchFile(/\.stories\.(ts|js)x?/i, false);

	const { path, name, ending } = parse_name(filename),
			story_filename = `./${path}/${name}.stories.${ending}`;

	//if(yield fileExists(story_filename)) return;

	// TODO: check source to find list of exports
	//const source = yield getSource();
	
	const new_path = trim_roots(roots_to_trim, path);

	const story_source = `import React from 'react';
import ${fixNaming(name)} from './${name}';

export default {
	title: '${new_path}/${name}',
};

export const Default = ({ ...args }) => (
	<${fixNaming(name)} {...args} />
);
Default.args = {

};
`;

	yield newFile(story_filename, story_source, true);
}

module.exports = {
	default: runner
};
