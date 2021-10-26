import type { Egg, EggEventHandler } from '@redux-eggs/core'

import { loadPostsWatcher } from '@/eggs/posts/saga'
import { POSTS_SLICE, postsReducer } from '@/eggs/posts/slice'
import type { AppStore } from '@/store'

export interface PostsEggParams {
  afterAdd?: EggEventHandler<AppStore>
}

export const getPostsEgg = ({ afterAdd }: PostsEggParams = {}): Egg<AppStore> => {
  return {
    id: 'posts',
    reducerMap: {
      [POSTS_SLICE]: postsReducer,
    },
    sagas: [loadPostsWatcher],
    afterAdd,
  }
}
