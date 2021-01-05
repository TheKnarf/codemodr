<p align="center">
   <img src="Logo/CodemodR.svg" width="50%" />
</p>

[![NpmVersion](https://img.shields.io/npm/v/codemodr.svg)](https://www.npmjs.com/package/codemodr)

A codemod runner supporting ES6 generators.

```
npm install --global codemodr
```

## Config

You can configure folders where Codemodr will look for codemods by creating a config file in your home directory called `.codemodr`:

```
exports.default = {
	codemods: [
		{ folder: "/Users/user/projects/codemodr/codemods/" }
	]
}
```
