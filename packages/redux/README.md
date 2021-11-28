# Redux Eggs for Redux

_Redux Eggs_ wrapper for [Redux](https://redux.js.org/).

Contents:

- [Installation](#installation)
- [Usage](#usage)
- [Glossary](https://github.com/fostyfost/redux-eggs/tree/main/docs/glossary.md)
- [Examples](https://github.com/fostyfost/redux-eggs/tree/main/docs/examples.md)

## Installation:

If you are using **Yarn**, run

```shell
yarn add @redux-eggs/core @redux-eggs/redux
```

If you are using **NPM**, run

```shell
npm install --save @redux-eggs/core @redux-eggs/redux
```

⚠️ Minimum supported versions of **peer dependencies**:

- `redux` 4.0.0 and newer

## Usage

Create your store:

```typescript
import { createStore } from '@redux-eggs/redux'

export const store = createStore()
```

Add reducer to `egg`:

```typescript
// my-egg.js
import { myReducer } from '../my-reducer'

export const getMyEgg = () => {
  return {
    id: 'my-egg',
    reducersMap: {
      myState: myReducer,
      // ...
    },
    // ...
  }
}

// my-another-egg.js
import { myAnotherReducer } from '../my-another-reducer'

export const getMyAnotherEgg = () => {
  return {
    id: 'my-another-egg',
    reducersMap: {
      myAnotherState: myAnotherReducer,
      // ...
    },
    // ...
  }
}
```

Add `egg` to your store:

```typescript
import { getMyEgg } from '../eggs/my-egg'

// Somewhere in your application
store.addEggs([getMyEgg()])

// Somewhere else
import { getMyAnotherEgg } from '../eggs/my-another-egg'

// Somewhere in your application
store.addEggs([getMyAnotherEgg()])
```
