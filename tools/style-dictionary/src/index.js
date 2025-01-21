import StyleDictionary from 'style-dictionary';
import { formats, transformGroups } from 'style-dictionary/enums';

const sd = new StyleDictionary({
  log: {
    verbosity: "verbose"
  },
  source: ['tokens/**/*.json'],
  platforms: {
    css: {
      transformGroup: transformGroups.css,
      buildPath: '../../apps/frontend/src/styles/',
      files: [
        {
          destination: 'tokens.css',
          format: formats.cssVariables,
        },
      ],
    },
  },
});

await sd.buildAllPlatforms();