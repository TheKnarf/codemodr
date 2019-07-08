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

module.exports = {
	matchFile,
	getFile,
	getSource,
	updateSource,
};
