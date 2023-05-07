# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [3.0.0-alpha.1](https://github.com/fostyfost/redux-eggs/compare/v3.0.0-alpha.0...v3.0.0-alpha.1) (2023-05-07)

**Note:** Version bump only for package redux-eggs-mono

# [2.2.0](https://github.com/fostyfost/redux-eggs/compare/v2.1.0...v2.2.0) (2022-03-21)

### Features

- **@redux-eggs/react:** add `withEggs` HOC ([69819ee](https://github.com/fostyfost/redux-eggs/commit/69819eea2f8f52b61b84fd6dd8d793de57884f94))
- **examples:** improve examples ([9d409f8](https://github.com/fostyfost/redux-eggs/commit/9d409f835d46ad786562777e77a10a0d560b930d))
- **examples:** update examples ([abc95c9](https://github.com/fostyfost/redux-eggs/commit/abc95c9c8dc56d3d15a384572798a09cf9067438))

# [2.1.0](https://github.com/fostyfost/redux-eggs/compare/v2.0.0...v2.1.0) (2021-12-05)

### Features

- **@redux-eggs/core:** improve types of `eggs` and `extensions` ([7773229](https://github.com/fostyfost/redux-eggs/commit/77732292feaee0e3ddf741e42f57dacdc94f51b2))
- **examples:** fix examples ([233176a](https://github.com/fostyfost/redux-eggs/commit/233176a46f897fe11de35fa6bff8f722b0c15d7a))
- **examples:** fix examples ([4707f92](https://github.com/fostyfost/redux-eggs/commit/4707f924deb7da84ebd7eb0a59ec2807b509c43f))
- **examples:** update examples ([42b8c61](https://github.com/fostyfost/redux-eggs/commit/42b8c611c3e8bdd4f16b36ddb2602b3f70433ff0))

# [2.0.0](https://github.com/fostyfost/redux-eggs/compare/v1.0.6...v2.0.0) (2021-12-04)

### Bug Fixes

- **examples:** use latest version for `@redux-eggs/*`-packages ([50c9262](https://github.com/fostyfost/redux-eggs/commit/50c92627aeaf3c623a7b5d4ac6016c28d937e64c))

- feat!: version 2 ([9b96c3d](https://github.com/fostyfost/redux-eggs/commit/9b96c3d764513b68938fffebe785b0d9dd015a50))

### Features

- **@redux-eggs/core:** refactor `flat`-util ([be6d766](https://github.com/fostyfost/redux-eggs/commit/be6d7665d49552bf19d54bc81556e23e2c6dd048))
- **examples:** improve `next-rtk`-example ([cb68599](https://github.com/fostyfost/redux-eggs/commit/cb68599b03170276182e29f00ba4a62c84e7b2c9))

### BREAKING CHANGES

- use `reducersMap` instead of `reducerMap` in your `eggs`.
- use `StoreCreatorOptions` instead of `StoreCreatorSettings`.
- `ExtensionEventHandlers` was removed.
- use `keep` instead of `eternal` in `egg` object.
- use `CounterItem` instead of `CountedItem` for item of `counter`.
  Another changes:
- refactor examples
- refactor tests
- remove `@ts-ignore`
- improve `jest-config`
- improve `rollup-plugin-filesize`
- add some info to `package.json`
- update `yarn`

## [1.0.6](https://github.com/fostyfost/redux-eggs/compare/v1.0.5...v1.0.6) (2021-10-26)

### Bug Fixes

- **deps:** use `core`-package as peer-dep ([97b1e68](https://github.com/fostyfost/redux-eggs/commit/97b1e688a90493cec34989b8d906ab6628a6a232))
- **examples:** fix build ([22ff44d](https://github.com/fostyfost/redux-eggs/commit/22ff44de6d3184f5ed8cb8f93a9759b2f986e5da))
- **examples:** fix examples for `getStaticPaths` ([9ed7157](https://github.com/fostyfost/redux-eggs/commit/9ed715752a2c105564d39784cffb8f9803a71e17))
- **examples:** refactor examples ([c171f46](https://github.com/fostyfost/redux-eggs/commit/c171f46df1a625c5d120584ccc23453b092755e1))

### Features

- **examples:** add example for `Next.js` with `RTK`, refactor another examples ([7e84d9b](https://github.com/fostyfost/redux-eggs/commit/7e84d9bd3536690d79bf5253e176b8e9e5222236))

## [1.0.5](https://github.com/fostyfost/redux-eggs/compare/v1.0.4...v1.0.5) (2021-10-01)

### Bug Fixes

- **@redux-eggs/core:** filter eggs without `id` ([8658e5b](https://github.com/fostyfost/redux-eggs/commit/8658e5bc2ecc979018db3d449fc0c928529c36e1))
- **@redux-eggs/saga-extension:** remove `readonly` for `sagas` type ([f5f81fa](https://github.com/fostyfost/redux-eggs/commit/f5f81fa95e6bdce43f918505bca26149b9264631))

## [1.0.4](https://github.com/fostyfost/redux-eggs/compare/v1.0.3...v1.0.4) (2021-09-28)

**Note:** Version bump only for package redux-eggs-mono
