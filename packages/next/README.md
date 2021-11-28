# Redux Eggs wrapper for Next.js

_Redux Eggs_ wrapper for [Next.js](https://nextjs.org/) applications. This library works in a similar way
to [Next Redux Wrapper](https://github.com/kirill-konshin/next-redux-wrapper).

Contents:

- [Installation](#installation)
- [Usage](#usage)
- [Glossary](https://github.com/fostyfost/redux-eggs/tree/main/docs/glossary.md)
- [Examples](https://github.com/fostyfost/redux-eggs/tree/main/docs/examples.md)

## Installation:

If you are using **Yarn**, run

```shell
yarn add @redux-eggs/core @redux-eggs/next
```

If you are using **NPM**, run

```shell
npm install --save @redux-eggs/core @redux-eggs/next
```

⚠️ Minimum supported versions of **peer dependencies**:

- `next` 11.1.0 and newer
- `react` 16.8.3 and newer
- `react-redux` 7.0.0 and newer

## Usage

Create your store:

```typescript
import { createWrapperInitializer } from '@redux-eggs/next'
import { createStore } from '@redux-eggs/redux-toolkit'
import { combineReducers } from '@reduxjs/toolkit'

const combiner = reducersMap => {
  const combinedReducer = combineReducers(reducersMap)

  return (state = {}, action) => {
    if (action.type === StoreActionType.HYDRATE && action.payload) {
      return combinedReducer({ ...state, ...action.payload }, action)
    }

    return combinedReducer(state, action)
  }
}

const createAppStore = () => createStore({ combiner })

export const wrapperInitializer = createWrapperInitializer(createAppStore, {
  hydrationActionType: StoreActionType.HYDRATE,
})
```

Wrap your App:

```typescript jsx
import { Layout } from '../components/layout'
import { getCommonEgg } from '../eggs/common'
import { wrapperInitializer } from '../store'

const CustomApp = ({ Component, pageProps }) => {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}

const beforeResult = async store => {
  if (typeof window === 'undefined') {
    // ...any async tasks for SSR
  }
}

const wrapper = wrapperInitializer.getAppWrapper([getCommonEgg()], { beforeResult })

export default wrapper.wrapApp(CustomApp)
```

Wrap your Error Page:

```typescript jsx
import { wrapperInitializer } from '../store'

const ErrorPage = () => {
  return (
    <div>
      <h1>ERROR</h1>
    </div>
  )
}

const wrapper = wrapperInitializer.getPageWrapper()

// Use this if your wrapper for `_app` has `beforeResult` function
export const getStaticProps = wrapper.wrapGetStaticProps()

export default wrapper.wrapPage(ErrorPage)
```

Wrap your page like this:

```typescript jsx
import { Posts } from '../components/posts'
import { getPostsEgg } from '../eggs/posts'
import { loadPosts } from '../eggs/posts/slice'
import { wrapperInitializer } from '../store'

const wrapper = wrapperInitializer.getPageWrapper([getPostsEgg()])

const PostsPage = wrapper.wrapPage(({ title }) => {
  return (
    <div>
      <h1>{title}</h1>
      <Posts />
    </div>
  )
})

export const getStaticProps = wrapper.wrapGetStaticProps(store => () => {
  store.dispatch(loadPosts())

  return {
    props: {
      title: 'Posts',
    },
  }
})

export default PostsPage
```

...or like this:

```typescript jsx
import { Posts } from '../components/posts'
import { getPostsEgg } from '../eggs/posts'
import { loadPosts } from '../eggs/posts/slice'
import { wrapperInitializer } from '../store'

const wrapper = wrapperInitializer.getPageWrapper([getPostsEgg()])

const PostsPage = wrapper.wrapPage(({ title }) => {
  return (
    <div>
      <h1>{title}</h1>
      <Posts />
    </div>
  )
})

export const getServerSideProps = wrapper.wrapGetServerSideProps(store => async () => {
  store.dispatch(loadPosts())

  return {
    props: {
      title: 'Posts',
    },
  }
})

export default PostsPage
```

...or like this:

```typescript jsx
import { Posts } from '../components/posts'
import { getPostsEgg } from '../eggs/posts'
import { loadPosts } from '../eggs/posts/slice'
import { wrapperInitializer } from '../store'

const wrapper = wrapperInitializer.getPageWrapper([getPostsEgg()])

const PostsPage = wrapper.wrapPage(({ title }) => {
  return (
    <div>
      <h1>{title}</h1>
      <Posts />
    </div>
  )
})

PostsPage.getInitialProps = wrapper.wrapGetInitialProps(store => () => {
  store.dispatch(PostsPublicAction.loadPosts())

  return {
    title: 'Posts',
  }
})

export default PostsPage
```
