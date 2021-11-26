# Redux Eggs for Redux Toolkit

_Redux Eggs_ wrapper for [Redux Toolkit](https://redux-toolkit.js.org/).

Contents:

- [Installation](#installation)
- [Usage](#usage)
- [Examples](#examples)

## Installation:

If you are using **Yarn**, run

```shell
yarn add @redux-eggs/core @redux-eggs/redux-toolkit
```

If you are using **NPM**, run

```shell
npm install --save @redux-eggs/core @redux-eggs/redux-toolkit
```

⚠️ Minimum supported versions of **peer dependencies**:

- `@reduxjs/toolkit` 1.6.0 and newer

## Usage

Create your store:

```typescript
import { createStore } from '@redux-eggs/redux-toolkit'

export const store = createStore()
```

Add reducer from slice to `egg`:

```typescript
// my-egg.js
import { mySlice } from '../my-slice'

export const getMyEgg = () => {
  return {
    id: 'my-egg',
    reducersMap: {
      myState: mySlice.reducer,
      // ...
    },
    // ...
  }
}

// my-another-egg.js
import { myAnotherSlice } from '../my-another-slice'

export const getMyAnotherEgg = () => {
  return {
    id: 'my-another-egg',
    reducersMap: {
      myAnotherState: myAnotherSlice.reducer,
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

## Examples

See examples [here](https://github.com/fostyfost/redux-eggs/tree/main/docs/examples.md).
