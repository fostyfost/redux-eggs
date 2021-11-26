# `getCounter([equalityCheck], [checkIsEternal])`

This function allows you to create `counter` to count the additions of values.

## Arguments

### `equalityCheck(left, right)`

Optional. This is a function for determining equality between `left` and` right` arguments. Strict comparison is used by
default.

```typescript
const defaultEqualityCheck = (left, right) => left === right
```

It takes two values for comparison and returns `true` if both values are equal, otherwise it returns` false`.

Example:

```typescript
import { getCounter } from '@redux-eggs/core'

const myEqualityCheck = (left, right) => left.id === right.id

const myCounter = getCounter(equalityCheck)

const obj1 = {
  id: 'aaa',
  // ...
}

const obj2 = {
  id: 'bbb',
  // ...
}

myCounter.add(obj1) // count of obj1 is 1
myCounter.add(obj2) // count of obj1 is 1, count of obj2 is 1

myCounter.add(obj1) // count of obj1 is 2, count of obj2 is 1
myCounter.add(obj2) // count of obj1 is 2, count of obj2 is 2
```

### `checkIsEternal(value)`

Optional. This is a function that checks if `value` should be in `counter` forever. It is useful for cases when `value`
cannot be removed from `counter` for some reason. By default, it returns `false`.

```typescript
const defaultCheckIsEternal = () => false
```

It accepts `value` of any type and returns `true` if the `value` should be in `counter` forever, otherwise, it
returns `false`.

Example:

```typescript
import { getCounter } from '@redux-eggs/core'

const myCheckIsEternal = value => value.isEternal === true

const myCounter = getCounter(undefined, myCheckIsEternal)

const obj1 = {
  id: 'aaa',
  isEternal: true,
  // ...
}

const obj2 = {
  id: 'bbb',
  // ...
}

myCounter.add(obj1) // count of obj1 is Infinite
myCounter.add(obj2) // count of obj1 is Infinite, count of obj2 is 1

myCounter.remove(obj1) // count of obj1 is Infinite
myCounter.remove(obj2) // count of obj1 is Infinite, count of obj2 is 0
```

## Returns

`getCounter` returns `counter` object.

```typescript
import { getCounter } from '@redux-eggs/core'

const counter = getCounter()
```

### `counter.add(item)`

This method adds `item` to `counter`.

Example:

```typescript
import { counter } from '../my-counter'

const item = {
  id: '123',
  // ...
}

counter.add(item)
```

### `counter.remove(item)`

This method removes `item` from `counter`.

Example:

```typescript
import { counter } from '../my-counter'

const item = {
  id: '123',
  // ...
}

counter.remove(item)
```

### `counter.getCount(item)`

This method returns the number of times `item` has been added to the `counter`. If `counter` does not contain `item`, it
returns `0`.

Example:

```typescript
import { counter } from '../my-counter'

const item = {
  id: '123',
  // ...
}

counter.add(item)

console.log(counter.getCount(item)) // -> 1

counter.remove(item)

console.log(counter.getCount(item)) // -> 0
```

### `counter.getItems()`

This method returns the entire contents of `counter`.

Example:

```typescript
import { counter } from '../my-counter'

console.log(counter.getItems()) // -> []

const item1 = { id: '1' }
const item2 = { id: '2' }

counter.add(item1)
counter.add(item2)

console.log(counter.getItems(item)) // -> [{ value: { id: '1' }, count: 1 }, { value: { id: '2' }, count: 1 }]
```
