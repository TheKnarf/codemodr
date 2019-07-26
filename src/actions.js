const matchFile = match => ({
	type: 'matchFile',
	match,
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

module.exports = {
	matchFile,
	getFile,
	getSource,
	updateSource,
	deleteSource,
	fileExists,
};
