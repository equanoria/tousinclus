import StyleDictionary from 'style-dictionary';

// Format personnalisé pour inclure les deux thèmes dans un seul fichier
StyleDictionary.registerFormat({
  name: 'css/theme-variables',
  format: ({ dictionary }) => {
    const lightTokens = dictionary.allTokens
      .filter(token => token.path.includes('light'))
      .map(token => `  --${token.name.replace('light-', '')}: ${token.value};`)
      .join('\n');

    const darkTokens = dictionary.allTokens
      .filter(token => token.path.includes('dark'))
      .map(token => `  --${token.name.replace('dark-', '')}: ${token.value};`)
      .join('\n');

    return `[data-theme="light"] {\n${lightTokens}\n}\n\n[data-theme="dark"] {\n${darkTokens}\n}`;
  }
});

const styleDictionary = StyleDictionary.extend({
  source: ['tokens/design-tokens.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'build/css/',
      files: [
        {
          destination: 'theme-variables.css',
          format: 'css/theme-variables'
        }
      ]
    }
  }
});

await styleDictionary.buildAllPlatforms();
