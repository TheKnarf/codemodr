#!/usr/bin/env node
/*
 * Custom codemods runner that support yieldables
 */

const fs = require('fs'),
		path = require('path'),
		glob = require('glob'),
		commander = require('commander'),
		program = new commander.Command();

program
	.version('0.0.1')
	.usage('[options] <files ...>')
	.description('Codemods runner supporting yieldables')
	.option('-t, --transform <file>', 'path to the transform codemod', './transform.js')
	.option('-d, --dry', 'dry run, no changes are made to files', false)

program.parse(process.argv);

if( process.argv.length < 3 )
	return program.outputHelp();

if(!fs.existsSync(program.transform)) {
	return console.error(`Couldn't find ${program.transform}, maybe you forgot to choose codemod using -t?`);
}

const asyncReadFile = async (file, encoding='utf8') => new Promise((resolve, reject) =>
	fs.readFile(file, encoding, (err, content) => {
		if(err) return reject(err);
		resolve(content);
	})
);

const asyncWriteFile = async (file, content) => new Promise((resolve, reject) =>
	fs.writeFile(file, content, (err) => {
		if(err) return reject(err);
		resolve();
	})
);

const asyncGlob = async (pattern) => new Promise((resolve, reject) =>
	glob(pattern, (err, files) => {
		if(err) return reject(err);
		resolve(files);
	})
);

(async ()=>{
	const actions = require('./actions.js');
	const content = await asyncReadFile(program.transform);	
	
	const generator = eval(content).default;
	const files = await asyncGlob(program.args[0]);

	files.forEach(async (file) => {
		const runner = (generator)(actions);

		let isDone = false;
		let sendNext = undefined;
		do {
			const { value, done } = runner.next(sendNext);
			sendNext = undefined;
			isDone = done;

			if(typeof value == 'undefined') continue;

			switch(value.type) {
				case actions.matchFile().type:
					if(!value.match.test(file))
						return;
				break;
				case actions.getFile().type:
					sendNext = await asyncReadFile(value.filename);
				break;
				case actions.getSource().type:
					sendNext = await asyncReadFile(file);
				break;
				case actions.updateSource().type:
					await asyncWriteFile(file, value.source);
					console.log(`${file} updated`);
				break;
				default:
					//console.log(output);
			}
		}
		while( !isDone );
	});
})();
