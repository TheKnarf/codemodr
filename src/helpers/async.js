const globCallback = require('glob'),
		fs = require('fs');

const readFile = async (file, encoding='utf8') => new Promise((resolve, reject) =>
	fs.readFile(file, encoding, (err, content) => {
		if(err) return reject(err);
		resolve(content);
	})
);

const writeFile = async (file, data) => new Promise((resolve, reject) =>
	fs.writeFile(file, data, (err) => {
		if(err) return reject(err);
		resolve();
	})
);

const deleteFile = async (file) => new Promise((resolve, reject) =>
	fs.unlink(file, (err) => {
		if(err) return reject(err);
	})
);

const glob = async (pattern) => new Promise((resolve, reject) =>
	globCallback(pattern, (err, files) => {
		if(err) return reject(err);
		resolve(files);
	})
);

// Based on: https://flaviocopes.com/how-to-check-if-file-exists-node/
const fileExists = async (path) => new Promise((resolve, reject) =>
	fs.access(path, fs.F_OK, (err) => {
		if(err) return resolve(false);
		resolve(true);
	})
);

const mkdir = async (path) => new Promise((resolve, reject) =>
	fs.mkdir(path, { recursive: true }, (err) => {
		if(err) return reject(err);
		resolve();
	})
);

const rename = async (oldPath, newPath) => new Promise((resolve, reject) =>
	fs.rename(oldPath, newPath, (err) => {
		if(err) return reject(err);
		resolve();
	})
);

module.exports = {
	readFile,
	writeFile,
	deleteFile,
	fileExists,
	glob,
	mkdir,
	rename,
};
