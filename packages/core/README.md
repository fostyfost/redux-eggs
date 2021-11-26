# Redux Eggs Core

This package includes logic for creating Redux store and adding/removing/counting `eggs`.

- [Intro](#intro)
- [Installation](#installation)
- [API Reference](#api-reference)

## Intro

The main function that does all the work is called [buildStore](#api-reference).

Most likely you will never need to use this function directly, since _Redux Eggs_ already includes packages
like [@redux-eggs/redux](https://github.com/fostyfost/redux-eggs/tree/main/packages/redux#readme)
and [@redux-eggs/redux-toolkit](https://github.com/fostyfost/redux-eggs/tree/main/packages/redux-toolkit#readme), which
are a high-level API for creating Redux store using [Redux](https://redux.js.org/)
or [Redux Toolkit](https://redux-toolkit.js.org/), respectively.

## Installation:

If you are using **Yarn**, run

```shell
yarn add @redux-eggs/core
```

If you are using **NPM**, run

```shell
npm install --save @redux-eggs/core
```

## API Reference

### `buildStore(storeCreator, combiner, composeMiddlewares, [extensions])`

This is a wrapper that allows you to create Redux store with the necessary methods to add/remove/count `eggs`. It
returns an object with Redux store
and [some methods](https://github.com/fostyfost/redux-eggs/tree/main/docs/store-with-eggs.md) from _Redux Eggs_.

Arguments:

`storeCreator(reducer, middlewareEnhancer, enhancersFromExtensions, middlewaresFromExtensions)`

- `reducer` - a root [reducer](https://redux.js.org/understanding/thinking-in-redux/glossary#reducer) that is required
  to dynamically add/remove reducers.
- `middlewareEnhancer` - a root [middleware](https://redux.js.org/understanding/thinking-in-redux/glossary#middleware)
  that is required to dynamically add/remove middleware.
- `enhancersFromExtensions` - an array
  of [enhancers](https://redux.js.org/understanding/thinking-in-redux/glossary#store-enhancer) from `Extensions`.
- `middlewaresFromExtensions` - an array
  of [middlewares](https://redux.js.org/understanding/thinking-in-redux/glossary#middleware) from `Extensions`.

`combiner(reducersMap)`

A function for _combining reducers_. Default: [combineReducers](https://redux.js.org/api/combinereducers).

`composeMiddlewares(...functions)`

A function for _composing middlewares_. Default: [compose](https://redux.js.org/api/compose).

`extensions`

An array of `Extensions`. This is an optional argument.

Example:

```typescript
import { buildStore } from '@redux-eggs/core'
import * as Redux from 'redux'

const store = buildStore(reducer => Redux.createStore(reducer), Redux.combineReducers, Redux.compose)
```

### `REDUCE_ACTION_TYPE`

[Redux Action Type](https://redux.js.org/faq/actions). Redux action with this type is triggered after a successful
addition or removal of reducers. This is an internal action, it is necessary for the correct state update after adding
or removing reducers.

Example:

```typescript
import { REDUCE_ACTION_TYPE } from '@redux-eggs/core'

const myMiddleware = store => next => action => {
  if (action.type === REDUCE_ACTION_TYPE) {
    console.log(action) // -> { type: '@@eggs/reduce' }
  }

  return next(action)
}
```

### `getCounter([equalityCheck], [checkIsEternal])`

This function will be useful for developers of extensions for _Redux Eggs_. All details you can
find [here](https://github.com/fostyfost/redux-eggs/tree/main/docs/core-counter.md).
