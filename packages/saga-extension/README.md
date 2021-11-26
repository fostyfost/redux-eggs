# Redux Eggs Saga Extension

_Redux Eggs_ extension that brings dynamic [sagas](https://redux-saga.js.org/) to your Redux store.

Contents:

- [Installation](#installation)
- [Usage](#usage)
- [Examples](#examples)

## Installation:

If you are using **Yarn**, run

```shell
yarn add @redux-eggs/core @redux-eggs/saga-extension
```

If you are using **NPM**, run

```shell
npm install --save @redux-eggs/core @redux-eggs/saga-extension
```

⚠️ Minimum supported versions of **peer dependencies**:

- `redux-saga` 1.1.0 and newer

## Usage

Create your store:

```typescript
import { createStore } from '@redux-eggs/redux-toolkit'
import { getSagaExtension } from '@redux-eggs/saga-extension'

export const store = createStore({ extensions: [getSagaExtension()] })
```

Add sagas to your `eggs`:

```typescript
// my-egg-with-sagas.js
export const getMyEggWithSagas = () => {
  return {
    id: 'my-egg-with-sagas',
    sagas: [mySaga1, mySaga2],
    // ...
  }
}

// my-another-egg-with-sagas.js
export const getMyAnotherEggWithSagas = () => {
  return {
    id: 'my-another-egg-with-sagas',
    sagas: [mySaga3, mySaga4],
    // ...
  }
}
```

Your sagas will run automatically, just add them to your store:

```typescript
import { getMyEggWithSagas } from '../eggs//my-egg-with-sagas'
import { getMyAnotherEggWithSagas } from '../eggs/my-another-egg-with-sagas'

// Somewhere in your application
store.addEggs([getMyEggWithSagas(), getMyAnotherEggWithSagas()])
```

Remove your sagas from store, they will be cancelled automatically:

```typescript
// Somewhere in your application
const remove = store.addEggs([
  /* array of `eggs` */
])

// ...later
remove()
```

## Examples

See examples [here](https://github.com/fostyfost/redux-eggs/tree/main/docs/examples.md).
