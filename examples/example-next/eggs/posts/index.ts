import type { Egg, EggEventHandler } from '@redux-eggs/redux'

import { POSTS_REDUCER_KEY, postsReducer } from '@/eggs/posts/reducer'
import { loadPostsWatcher } from '@/eggs/posts/saga'
import type { AppStore } from '@/store'

export interface PostsEggParams {
  afterAdd?: EggEventHandler<AppStore>
}

export const getPostsEgg = ({ afterAdd }: PostsEggParams = {}): Egg<AppStore> => {
  return {
    id: 'posts',
    reducerMap: {
      [POSTS_REDUCER_KEY]: postsReducer,
    },
    sagas: [loadPostsWatcher],
    afterAdd,
  }
}
