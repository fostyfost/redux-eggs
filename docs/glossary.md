# Glossary

This is a glossary of the core terms in _Redux Eggs_, along with their type signatures.
[Here](https://redux.js.org/understanding/thinking-in-redux/glossary) you can find glossary for Redux.

Contents:

- [egg](#egg)
- [extension](#extension)
- [counter](#counter)

## `egg`

`egg` is an object with the following structure:

```typescript
import type { WithEggExt } from '@redux-eggs/core'
import type { Middleware, ReducersMapObject, Store } from 'redux'

interface Egg<S extends Store = Store> {
  readonly id: string
  reducersMap?: ReducersMapObject<any, any>
  middlewares?: Middleware[]
  readonly keep?: boolean
  beforeAdd?: EggEventHandler<S>
  afterAdd?: EggEventHandler<S>
  beforeRemove?: EggEventHandler<S>
  afterRemove?: EggEventHandler<S>
}

type EggEventHandler<S extends Store = Store> = (store: WithEggExt<S>) => void
```

- `id` - Unique identifier of `egg`. Required.
- `reducersMap` - Object which values correspond to different reducer functions. Used
  to [combine reducers](https://redux.js.org/api/combinereducers).
- `middlewares` - An array of
  dynamic [middlewares](https://redux.js.org/understanding/thinking-in-redux/glossary#middleware).
- `keep` - Pass `true` if `egg` should not be removed from Redux store.
- `beforeAdd` - An event handler to execute before adding `egg` to Redux store.
- `afterAdd` - An event handler to execute after adding `egg` to Redux store.
- `beforeRemove` - An event handler to execute before removing `egg` to Redux store.
- `afterRemove` - An event handler to execute after removing `egg` to Redux store.

⚠️ All event handlers of the same type will be combined before adding or removing several `eggs` at the same time.

### Example

```typescript
const getEgg1 = (): Egg<MyStore> => {
  return {
    id: 'egg-1',
    beforeAdd(store) {
      console.log('egg-1 before add')
      store.dispatch({ type: 'EGG_ACTION' })
    },
    afterAdd(store) {
      console.log('egg-1 after add')
      store.dispatch({ type: 'EGG_ACTION' })
    },
    beforeRemove(store) {
      console.log('egg-1 before remove')
      store.dispatch({ type: 'EGG_ACTION' })
    },
    afterRemove(store) {
      console.log('egg-1 after remove')
      store.dispatch({ type: 'EGG_ACTION' })
    },
  }
}

const getEgg2 = (): Egg<MyStore> => {
  return {
    id: 'egg-2',
    beforeAdd() {
      console.log('egg-2 before add')
    },
    afterAdd() {
      console.log('egg-2 after add')
    },
    beforeRemove() {
      console.log('egg-2 before remove')
    },
    afterRemove() {
      console.log('egg-2 after remove')
    },
  }
}

const removeAddedEggs = myStore.addEggs([egg1, egg2])

// Direct order
// egg-1 before add
// egg-2 before add
// egg-1 after add
// egg-2 after add

removeAddedEggs()

// Reverse order
// egg-2 before remove
// egg-1 before remove
// egg-2 after remove
// egg-1 after remove

// But:

myStore.removeEggs([egg1, egg2])

// Direct order
// egg-1 before remove
// egg-2 before remove
// egg-1 after remove
// egg-2 after remove
```

### What happens when you add `egg` to Redux store?

1. `beforeAdd` handlers of `extensions` are called. These handlers will receive an array of `eggs` to be added.
2. `beforeAdd` handler of `egg` is called.
3. Reducers of `egg` are registered with Redux store.
4. Redux action with type `REDUCE_ACTION_TYPE` is dispatched if `egg` has reducers.
5. Middlewares of `egg` are registered with Redux store.
6. `egg` is added to `counter`.
7. `afterAdd` handlers of `extensions` are called. These handlers will receive an array of `eggs` to be added.
8. `afterAdd` handler of `egg` is called.

### What happens when you remove `egg` from Redux store?

1. `beforeRemove` handlers of `extensions` are called. These handlers will receive an array of `eggs` to be removed.
2. `beforeRemove` handler of `egg` is called.
3. Reducers of `egg` are unregistered from Redux store.
4. Redux action with type `REDUCE_ACTION_TYPE` is dispatched if `egg` has reducers.
5. Middlewares of `egg` are unregistered from Redux store.
6. `egg` is removed from `counter`.
7. `afterRemove` handlers of `extensions` are called. These handlers will receive an array of `eggs` to be removed.
8. `afterRemove` handler of `egg` is called.

## `extension`

You can freely extend the functionality of _Redux Eggs_ through `extensions`.

`extension` is an object with the following structure:

```typescript
import type { Egg, WithEggExt } from '@redux-eggs/contracts'
import type { Middleware, Store, StoreEnhancer } from 'redux'

export interface Extension<S extends Store = Store> {
  middlewares?: Middleware[]
  enhancers?: StoreEnhancer<any, any>[]
  beforeAdd?: ExtensionEventHandler<S>[]
  afterAdd?: ExtensionEventHandler<S>[]
  beforeRemove?: ExtensionEventHandler<S>[]
  afterRemove?: ExtensionEventHandler<S>[]
}

export type ExtensionEventHandler<S extends Store = Store> = (eggs: Egg<S>[], store: WithEggExt<S>) => void
```

- `middlewares` - An array of
  static [middlewares](https://redux.js.org/understanding/thinking-in-redux/glossary#middleware).
- `enhancers` - An array
  of [store enhancers](https://redux.js.org/understanding/thinking-in-redux/glossary#store-enhancer).
- `beforeAdd` - An array of handlers to run before adding `eggs` to Redux store.
- `afterAdd` - An array of handlers to run after adding `eggs` to Redux store.
- `beforeRemove` - An array of handlers to run before removing `eggs` from Redux store.
- `afterRemove` - An array of handlers to run after removing `eggs` from Redux store.

### Example

```typescript
import { createStore } from '@redux-eggs/redux-toolkit'

const getMyExtension = (): Extension<any> => {
  return {
    beforeAdd: [
      (eggs, store) => {
        console.log('beforeAdd', eggs)
        store.dispatch({ type: 'EXTENSION_ACTION' })
      },
    ],
    afterAdd: [
      (eggs, store) => {
        console.log('afterAdd', eggs)
        store.dispatch({ type: 'EXTENSION_ACTION' })
      },
    ],
    beforeRemove: [
      (eggs, store) => {
        console.log('beforeRemove', eggs)
        store.dispatch({ type: 'EXTENSION_ACTION' })
      },
    ],
    afterRemove: [
      (eggs, store) => {
        console.log('afterRemove', eggs)
        store.dispatch({ type: 'EXTENSION_ACTION' })
      },
    ],
  }
}

const myStore = createStore({ extensions: [getMyExtension()] })

type MyStore = typeof myStore

const getEgg1 = (): Egg<MyStore> => {
  return {
    id: 'egg-1',
    beforeAdd() {
      console.log('egg-1 before add')
    },
    afterAdd() {
      console.log('egg-1 after add')
    },
    beforeRemove() {
      console.log('egg-1 before remove')
    },
    afterRemove() {
      console.log('egg-1 after remove')
    },
  }
}

const getEgg2 = (): Egg<MyStore> => {
  return {
    id: 'egg-2',
    beforeAdd() {
      console.log('egg-2 before add')
    },
    afterAdd() {
      console.log('egg-2 after add')
    },
    beforeRemove() {
      console.log('egg-2 before remove')
    },
    afterRemove() {
      console.log('egg-2 after remove')
    },
  }
}

const removeAddedEggs = myStore.addEggs([egg1, egg2])

// Direct order
// beforeAdd [{ ...egg1 }, { ...egg2 }]
// egg-1 before add
// egg-2 before add
// afterAdd [{ ...egg1 , { ...egg2 }}]
// egg-1 after add
// egg-2 after add

removeAddedEggs()

// Reverse order
// before
// beforeRemove [{ ...egg2, ...egg1 }]
// egg-2 before remove
// egg-1 before remove
// afterRemove [{ ...egg2, egg1 }]
// egg-2 before remove
// egg-1 before remove

// But

myStore.removeEggs([egg1, egg2])

// Direct order
// beforeRemove [{ ...egg1 }, { ...egg2 }]
// egg-1 before remove
// egg-2 before remove
// afterRemove [{ ...egg1 , { ...egg2 }}]
// egg-1 after remove
// egg-2 after remove
```

## `counter`

`counter` is an object that
provides [several methods](https://github.com/fostyfost/redux-eggs/tree/main/docs/core-counter.md) for storing and
counting the number of times a value has been added.

```typescript
interface Counter<T = unknown> {
  getCount(item: T): number
  getItems(): CounterItem<T>[]
  add(item: T): void
  remove(item: T): void
}

interface CounterItem<T> {
  value: T
  count: number
}
```
