# Redux store with Eggs

## `store.addEggs(eggsToBeAdded)`

This method adds `eggs` to Redux store or increases `counter` of previously added `eggs`. It can accept both flat and
multidimensional array of `eggs` as an argument. It returns a function that removes previously added `eggs` or reduces
their number in `counter`.

Example:

```typescript
import { store } from '../store'

const getMyEgg = () => {
  return {
    id: 'my-egg',
    reducersMap: {
      // ...
    },
    // ...
  }
}

const removeAddedEggs = store.addEggs([getMyEgg()])

// ...later

removeAddedEggs()
```

## `store.removeEggs(eggsToBeRemoved)`

This method removes `eggs` from Redux store or reduces the number of `eggs` in `counter`. It can accept both flat
and multidimensional array of `eggs` as an argument.

Example:

```typescript
import { store } from '../store'

const getMyEgg = () => {
  return {
    id: 'my-egg',
    reducersMap: {
      // ...
    },
    // ...
  }
}

store.removeEggs([getMyEgg()])
```

## `store.getEggs()`

This method returns an array of `eggs` that have been added to Redux store.

Example:

```typescript
import { store } from '../store'

console.log(store.getEggs()) // -> []

const getMyEgg = () => {
  return {
    id: 'my-egg',
    reducersMap: {
      // ...
    },
    // ...
  }
}

store.addEggs([getMyEgg()])

console.log(store.getEggs()) // -> [{ count: 1, value: { id: 'my egg-egg', reducersMap: { ... } } }]
```

## `store.getEggCount(egg)`

This method allows you to get the number of `egg` in `counter`.

Example:

```typescript
import { store } from '../store'

const getMyEgg = () => {
  return {
    id: 'my-egg',
    reducersMap: {
      // ...
    },
    // ...
  }
}

console.log(store.getEggCount(getMyEgg())) // -> 0

store.addEggs([getMyEgg()])
console.log(store.getEggCount(getMyEgg())) // -> 1

store.addEggs([getMyEgg()])
console.log(store.getEggCount(getMyEgg())) // -> 2

store.removeEggs([getMyEgg()])
console.log(store.getEggCount(getMyEgg())) // -> 1
```
