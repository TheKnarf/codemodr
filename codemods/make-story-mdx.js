const fixNaming = name => {
	name = name	
    .replace(
		 /\-+./gi,
		 x => x.substring(x.length-1).toUpperCase()
	 )
	.replace(
		 /\.+./gi,
		 x => x.substring(x.length-1).toUpperCase()
	 );

	// Capitalize
	name = name.charAt(0).toUpperCase() + name.slice(1);

	if(name === 'Index') {
		name = 'Component';
	}

	return name;
}

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
			story_filename = `./${path}/${name}.stories.mdx`;

	//if(yield fileExists(story_filename)) return;

	// TODO: check source to find list of exports
	//const source = yield getSource();
	
	const new_path = trim_roots(roots_to_trim, path);

	const title = name.toLowerCase === 'index' ? new_path : `${new_path}/${name}`;
	const componentName = fixNaming(name);

	const story_source = `import { Meta, Story, Canvas } from '@storybook/addon-docs/blocks';
import { ArgsTable } from '@storybook/addon-docs/blocks';
import ${componentName} from './${name}';

<Meta title='${title}' component={${componentName}} />

# ${componentName}

With \`MDX\` we can define a story for \`${componentName}\` right in the middle of our
Markdown documentation.

export const Template = (args) => <${componentName} {...args} />

<Canvas>
  <Story name="Default" args={{
		children: 'test'
  }}>
	{Template.bind({})}
  </Story>
</Canvas>

<ArgsTable of={${componentName}} />
`;

	yield newFile(story_filename, story_source, true);
}

module.exports = {
	default: runner
};
