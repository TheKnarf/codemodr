const { fixClassName } = require('./helpers/className.js');

export default function transformer(file, api) {
	const j = api.jscodeshift,
        root = j(file.source);

  root
		.find(j.ImportDeclaration)
		.forEach(path => {
			const importV = path.value.source.value;

			if(/\.css$/.test(importV) && !/\.module\.css$/.test(importV)) {
        const newName = importV.substring(0, importV.length - 4) + '.module.css';
        j(path).replaceWith(`import css from '${newName}';`)
			}
		})

  root
    .find(j.JSXAttribute)
    .filter(path => path.value.name.name == 'className')
    .forEach(path => {
      j(path)
        .find(j.StringLiteral)
        .forEach(path => {
          if(!/^\ *$/.test(path.value.value)) {
            const newClassName = path.value.value
              .split(' ')
              .map(fixClassName)
              .map(name => `css.${name}`);

            if(newClassName.length == 1) {
              j(path).replaceWith(`{${newClassName[0]}}`);
            } else {
              const arr = newClassName.join(',');
              j(path).replaceWith(`{[${arr}].join(' ')}`);;
            }
          }
        });
    });

  return root.toSource();
}
export const parser = 'tsx';
