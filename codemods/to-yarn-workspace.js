const packageLock = function* ({ matchFile, deleteSource }) {
	yield matchFile(/^package\-lock\.json$/i);
	console.log('Yarn doesn\'t use package-lock files');
	yield deleteSource();
}

module.exports = {
	default: packageLock
};
