# Codemods

[![NpmVersion](https://img.shields.io/npm/v/codemodr.svg)](https://www.npmjs.com/package/codemodr)

Example usage:

```
# git clone && cd codemods
npm install -g jscodeshift
cd ../yourproject
jscodeshift -t ../codemods/src/css-module.js -p src/**/*.tsx
```

## Good resources for writing codemods

- https://dev.to/arminaskatilius/writing-javascript-codemods-and-understanding-ast-easily-48fc

- https://augustinlf.com/writing-codemods-to-transform-your-codebase/

Look more into:

- https://github.com/noahsug/gen-codemod
