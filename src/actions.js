const matchFile = (match, doMatch = true) => ({
	type: 'matchFile',
	match,
	doMatch,
});

const getFile = filename => ({
	type: 'readFile',
	filename,
});

const getSource = () => ({
	type: 'getSource',
});

const updateSource = source => ({
	type: 'updateSource',
	source,
});

const deleteSource = () => ({
	type: 'deleteSource',
});

const fileExists = filename => ({
	type: 'fileExists',
	filename,
});

const newFile = (filename, content, overwrite = false) => ({
	type: 'newFile',
	filename,
	content,
	overwrite,
});

const log = (...args) => ({
	type: 'log',
	args,
});

module.exports = {
	matchFile,
	getFile,
	getSource,
	updateSource,
	deleteSource,
	fileExists,
	newFile,
	log,
};
