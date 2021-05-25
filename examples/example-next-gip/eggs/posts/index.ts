import type { Egg, EggEventHandler } from '@redux-eggs/redux'

import type { AppStore } from '@/store'

import { postsReducer } from './reducer'
import { loadPostsWatcher } from './saga'

export const POSTS_MODULE_NAME = 'posts-egg' as const

export interface PostsEggParams {
  afterAdd?: EggEventHandler<AppStore>
}

export const getPostsEgg = ({ afterAdd }: PostsEggParams = {}): Egg<AppStore> => {
  return {
    id: POSTS_MODULE_NAME,
    reducerMap: {
      [POSTS_MODULE_NAME]: postsReducer,
    },
    sagas: [loadPostsWatcher],
    afterAdd,
  }
}
