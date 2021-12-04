# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [2.0.0](https://github.com/fostyfost/redux-eggs/compare/v1.0.6...v2.0.0) (2021-12-04)

- feat!: version 2 ([9b96c3d](https://github.com/fostyfost/redux-eggs/commit/9b96c3d764513b68938fffebe785b0d9dd015a50))

### Features

- **@redux-eggs/core:** refactor `flat`-util ([be6d766](https://github.com/fostyfost/redux-eggs/commit/be6d7665d49552bf19d54bc81556e23e2c6dd048))

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

**Note:** Version bump only for package @redux-eggs/core

## [1.0.5](https://github.com/fostyfost/redux-eggs/compare/v1.0.4...v1.0.5) (2021-10-01)

### Bug Fixes

- **@redux-eggs/core:** filter eggs without `id` ([8658e5b](https://github.com/fostyfost/redux-eggs/commit/8658e5bc2ecc979018db3d449fc0c928529c36e1))

## [1.0.4](https://github.com/fostyfost/redux-eggs/compare/v1.0.3...v1.0.4) (2021-09-28)

**Note:** Version bump only for package @redux-eggs/core
