import type { PayloadAction } from '@reduxjs/toolkit'
import { createAction, createSlice } from '@reduxjs/toolkit'

import type { PostsItem, PostsState } from '@/eggs/posts/contracts/state'
import { PostsLoadingState } from '@/eggs/posts/contracts/state'

export const POSTS_SLICE = 'posts' as const

const initialState: PostsState = {
  posts: [],
  loadingState: PostsLoadingState.NEVER,
}

const slice = createSlice({
  name: POSTS_SLICE,
  initialState,
  reducers: {
    setError(state, action: PayloadAction<string | undefined>) {
      state.error = action.payload
    },
    setPosts(state, action: PayloadAction<PostsItem[]>) {
      state.posts = action.payload
    },
    setLoadingState(state, action: PayloadAction<PostsLoadingState>) {
      state.loadingState = action.payload
    },
  },
})

export const postsReducer = slice.reducer

export const PostsReducerAction: typeof slice.actions = { ...slice.actions }

export const PostsPublicAction = {
  loadPosts: createAction(`${POSTS_SLICE}/LOAD_POSTS`),
}
