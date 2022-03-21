# Redux Eggs for React

This package provides higher-order component (HOC) and function to create an injector
component that allows you to add parts of Redux store before the component is mounted,
and remove them after the component is unmounted.

Contents:

- [Installation](#installation)
- [Usage](#usage)
- [Glossary](https://github.com/fostyfost/redux-eggs/tree/main/docs/glossary.md)
- [Examples](https://github.com/fostyfost/redux-eggs/tree/main/docs/examples.md)

## Installation:

If you are using **Yarn**, run

```shell
yarn add @redux-eggs/core @redux-eggs/react
```

If you are using **NPM**, run

```shell
npm install --save @redux-eggs/core @redux-eggs/react
```

⚠️ Minimum supported versions of **peer dependencies**:

- `react` 16.8.3 and newer
- `react-redux` 7.0.0 and newer

## Usage

### Usage with `withEggs` HOC (recommended 👍)

```typescript jsx
import { useSelector } from 'react-redux'

const getMyEgg = () => {
  return {
    id: 'my-egg',
    reducersMap: {
      myState: myReducer,
      // ...
    },
    // ...
  }
}

const selector = state => state.myState.value

export const MyComponent = withEggs([getMyEgg()])(function MyComponent() {
  const value = useSelector(selector)

  return <div>{value}</div>
})
```

### Usage with `getInjector`

Create your `eggs`:

```typescript
// my-egg.js
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

Configure your React Component(s):

```typescript jsx
// my-component.js
import { useSelector } from 'react-redux'

export const MyComponent = () => {
  const value = useSelector(state => state.myState.value)

  return <div>{value}</div>
}

// my-another-component.js
import { useSelector } from 'react-redux'

export const MyAnotherComponent = () => {
  const anotherValue = useSelector(state => state.myAnotherState.value)

  return <div>{anotherValue}</div>
}
```

Create `Injector` and wrap your React Component(s).

```typescript jsx
// app.js
import { getInjector } from '@redux-eggs/react'
import { Provider } from 'react-redux'

import { store } from './store'
import { getMyEgg } from './eggs/my-egg'
import { getMyAnotherEgg } from './eggs/my-another-egg'
import { MyComponent } from './components/my-component'
import { MyAnotherComponent } from './components/my-another-component'

const Injector = getInjector([getMyEgg(), getMyAnotherEgg()])

const App = () => {
  return (
    <Provider store={store}>
      <Injector.Wrapper>
        <MyComponent />
        <MyAnotherComponent />
      </Injector.Wrapper>
    </Provider>
  )
}
```

You shouldn't use destructuring assignment with result of `getInjector`.

Bad:

```typescript jsx
import { getInjector } from '@redux-eggs/react'

const { Wrapper } = getInjector([
  /* array of `eggs` */
])

const Component = () => {
  return (
    <Wrapper>
      <AnotherComponent />
    </Wrapper>
  )
}
```

Good:

```typescript jsx
import { getInjector } from '@redux-eggs/react'

const Injector = getInjector([
  /* array of `eggs` */
])

const App = () => {
  return (
    <Injector.Wrapper>
      <AnotherComponent />
    </Injector.Wrapper>
  )
}
```
