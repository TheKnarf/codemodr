const packageLock = function* ({ matchFile, deleteSource, log }) {
	yield matchFile(/^package\-lock\.json$/i);
	yield log('Yarn doesn\'t use package-lock files');
	yield deleteSource();
}

const packageJson = function* ({ matchFile, getSource, log }) {
	yield matchFile(/^package\.json$/);
	const source = JSON.parse(
		yield getSource()
	);

	if(typeof source.workspaces == 'undefined') {
		yield log('package.json is missing workspace propertie');
	}
}

module.exports = {
	default: packageJson//packageLock
};
