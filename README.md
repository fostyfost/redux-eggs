# Redux Eggs

Manipulate your store like an egg tray. Add some `eggs` to your Redux store.

Contents:

- [Intro](#intro)
- [Main advantages](#main-advantages)
- [Packages](#packages)
  - [Core](#core)
  - [Next](#next)
  - [React](#react)
  - [Redux](#redux)
  - [Redux Toolkit](#redux-toolkit)
  - [Redux-Saga extension](#redux-saga-extension)

## Intro

Here is a monorepository that contains packages that allow you to easily split your Redux store into separate
parts (`eggs`), and then dynamically add and remove them when you need it. This set of packages will allow you to reduce
the size of your Redux store and the first-load JavaScript by adding only the currently needed reducers and middlewares.
You no longer have to add all reducers and middlewares at once when creating your Redux store. If you need some kind of
reducer or middleware, you can dynamically add these constructs at runtime exactly when your application requires it.
You will be able to create reusable constructs with reducers and middlewares so that you can easily connect them in
different parts of your application. Moreover, if you need reusable parts of the Redux store in different projects,
you can also create separate reusable packages and use them in your projects.

If you are familiar with [Redux Dynamic Modules](https://github.com/microsoft/redux-dynamic-modules), then most likely
you know what is going on here.

## Main advantages

- 🍳 Simple to use.
- 🤏 Tiny small bundle size.
- 👌 Zero dependencies.
- ✅ SSR-ready.
- ⚙️ Built-in event mechanism.
- 🍒 Custom extensions.
- 🐕‍🦺 React Strict Mode supported.

## Packages

### Core

`@redux-eggs/core` - a package that includes the main logic for adding and removing parts of Redux store, connecting
extensions, triggering events, etc.

[More details here](https://github.com/fostyfost/redux-eggs/tree/main/packages/core#readme).

### Next

`@redux-eggs/next` - _Redux Eggs_ wrapper for [Next.js](https://nextjs.org/).

[More details here](https://github.com/fostyfost/redux-eggs/tree/main/packages/next#readme).

### React

`@redux-eggs/react` - a package that provides a function to create an injector component that allows you to add parts of
Redux store before the component is mounted, and remove them after the component is unmounted.

[More details here](https://github.com/fostyfost/redux-eggs/tree/main/packages/react#readme).

### Redux

`@redux-eggs/redux` - a wrapper for directly creating dynamic Redux store with plain [Redux](https://redux.js.org/).

[More details here](https://github.com/fostyfost/redux-eggs/tree/main/packages/redux#readme).

### Redux Toolkit

`@redux-eggs/redux-toolkit` - a wrapper for directly creating dynamic Redux store
with [Redux Toolkit](https://redux-toolkit.js.org/).

[More details here](https://github.com/fostyfost/redux-eggs/tree/main/packages/redux-toolkit#readme).

### Redux-Saga extension

`@redux-eggs/saga-extension` - an extension for _Redux Eggs_ that allows you to dynamically add or
remove [sagas](https://redux-saga.js.org/) from your Redux store.

[More details here](https://github.com/fostyfost/redux-eggs/tree/main/packages/saga-extension#readme).
