#!/usr/bin/env node
const actions = require('./actions.js'),
		async = require('./helpers/async'),
		os = require('os'),
		path = require('path'),
		commander = require('commander'),
		program = new commander.Command();

program
	.version('0.0.1')
	.usage('[options] <files ...>')
	.description('Codemods runner supporting yieldables')
	.option('-t, --transform <file>', 'path to the codemod')
	.option('-d, --dry', 'dry run, no changes are made to files', false)

program.parse(process.argv);

if( process.argv.length < 3 )
	return program.outputHelp();

const config_file_path = path.resolve(os.homedir() + '/.codemodr');
let codemod_search_paths = ['./'];

const findCodemod = async (transform, search_paths) => {
	const results = await Promise.all(search_paths.map(async search_path => {
		return await async.fileExists(path.join(search_path, transform));
	}));

	const index = results.findIndex(id=>id);
	if(index === -1) {
		console.log(results, search_paths, "\n\n");
		throw new Error(`Couldn't find transform '${transform}'`);
	}

	const filename = path.join(search_paths[index], transform);

	return await async.readFile(filename);
}

(async ()=>{
	if(await async.fileExists(config_file_path)) {
		console.log(`Loading config file at ${config_file_path}`);
		let config_content;
		try {
			config_content = await async.readFile(config_file_path);
		} catch(e) {
			console.error(e);
		}

		const config = eval(config_content);
		if(Array.isArray(config.codemods)) {
			config.codemods.forEach(({ folder }) => codemod_search_paths.push(folder));
		}
	}

	let content;
	try {
		content = await findCodemod(program.transform, codemod_search_paths);
	} catch(e) {
		console.error(e);
	}
	
	let generator;
	try {
		generator = eval(content);
		if(typeof generator.default == 'function') generator = generator.default;
	} catch(e) {
		console.error(e);
	}
	if(typeof generator !== 'function') {
		return console.error('Generator is not a function, something went wrong loading codemod');
	}

	const files = await async.glob(program.args[0]);

	files.forEach(async (file) => {
		const runner = (generator)(actions);

		let isDone = false;
		let sendNext = undefined;
		do {
			const { value, done } = runner.next(sendNext);
			sendNext = undefined;
			isDone = done;

			if(typeof value == 'undefined') continue;

			const log = (...args) => console.log(`(${program.transform}) ${file}:`, ...args);

			switch(value.type) {
				case actions.matchFile().type:
					const doesMatch = value.match.test(file)

					if(value.doMatch && !doesMatch) return;
					else if(!value.doMatch && doesMatch) return;

					sendNext = file;
				break;
				case actions.getFile().type:
					log('getFile', value.filename);
					sendNext = await async.readFile(value.filename);
				break;
				case actions.getSource().type:
					log('getSource');
					sendNext = await async.readFile(file);
				break;
				case actions.updateSource().type:
					await async.writeFile(file, value.source);
					log('updateSource');
				case actions.deleteSource().type:
					log('deleteSource');
					await async.deleteFile(file);
				break;
				case actions.fileExists().type:
					log('fileExists', value.filename);
					sendNext = await async.fileExists(value.filename);
				break;
				case actions.newFile().type:
					log('newFile', value.filename);
					if(await async.fileExists(value.filename)) {
						throw new Error(`newFile: file (${value.filename}) allready exists`);
					} else {
						await async.writeFile(value.filename, value.content);
					}
				break;
				case actions.log().type:
					log(...value.args);
				break;
				default:
					//console.log(output);
			}
		}
		while( !isDone );
	});
})();
