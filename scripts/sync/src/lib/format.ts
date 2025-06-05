import * as prettier from 'prettier';

export let format = async (source: string) => {
  return await prettier.format(source, {
    parser: 'typescript',
    singleQuote: true,
    semi: true,
    printWidth: 80,
    tabWidth: 2,
    trailingComma: 'none',
    bracketSpacing: true,
    arrowParens: 'avoid',
    useTabs: false
  });
};
