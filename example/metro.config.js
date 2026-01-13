const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '..');

const { withNativeWind } = require('nativewind/metro');

// Get the default config first
const defaultConfig = getDefaultConfig(__dirname);

// Manually define the exclusion list merging logic to avoid importing the restricted path
// We take the default blockList (if it exists) and add our own exclusions
const defaultBlockList = defaultConfig.resolver.blockList || [];

// Define our specific exclusions for the monorepo setup (React duplicate fix)
const additionalExclusions = [
  /node_modules\/.*\/node_modules\/react\/.*/,
  new RegExp(`${path.resolve(workspaceRoot, 'node_modules/react')}/.*`),
  new RegExp(`${path.resolve(workspaceRoot, 'node_modules/react-native')}/.*`),
];

// If defaultBlockList is already a RegExp, we combine using source.
// If it's an array (which exclusionList returns), we concat.
// However, since we can't easily rely on exclusionList utility, we'll construct a new combined RegExp.
// This matches how exclusionList typically works internally.
let combinedBlockList;
if (Array.isArray(defaultBlockList)) {
  combinedBlockList = new RegExp(
    defaultBlockList
      .concat(additionalExclusions)
      .map(r => r.source)
      .join('|'),
  );
} else if (defaultBlockList instanceof RegExp) {
  combinedBlockList = new RegExp(
    '(' +
      defaultBlockList.source +
      ')|(' +
      additionalExclusions.map(r => r.source).join('|') +
      ')',
  );
} else {
  // Fallback if undefined or empty
  combinedBlockList = new RegExp(
    additionalExclusions.map(r => r.source).join('|'),
  );
}

const config = mergeConfig(defaultConfig, {
  /* your config */
  watchFolders: [workspaceRoot],
  resolver: {
    blockList: combinedBlockList,
    nodeModulesPaths: [
      path.resolve(projectRoot, 'node_modules'),
      path.resolve(workspaceRoot, 'node_modules'),
    ],
    extraNodeModules: {
      react: path.resolve(projectRoot, 'node_modules/react'),
      'react-native': path.resolve(projectRoot, 'node_modules/react-native'),
    },
  },
});

module.exports = withNativeWind(config, { input: './global.css' });
