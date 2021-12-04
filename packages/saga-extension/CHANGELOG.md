# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [2.0.0](https://github.com/fostyfost/redux-eggs/compare/v1.0.6...v2.0.0) (2021-12-04)

- feat!: version 2 ([9b96c3d](https://github.com/fostyfost/redux-eggs/commit/9b96c3d764513b68938fffebe785b0d9dd015a50))

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

## [1.0.5](https://github.com/fostyfost/redux-eggs/compare/v1.0.4...v1.0.5) (2021-10-01)

### Bug Fixes

- **@redux-eggs/saga-extension:** remove `readonly` for `sagas` type ([f5f81fa](https://github.com/fostyfost/redux-eggs/commit/f5f81fa95e6bdce43f918505bca26149b9264631))

## [1.0.4](https://github.com/fostyfost/redux-eggs/compare/v1.0.3...v1.0.4) (2021-09-28)

**Note:** Version bump only for package @redux-eggs/saga-extension
