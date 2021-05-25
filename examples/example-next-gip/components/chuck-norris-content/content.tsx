import { getInjector } from '@redux-eggs/react'
import type { FC } from 'react'
import { useSelector } from 'react-redux'

import { getChuckNorrisEgg } from '@/eggs/chuck-norris'
import { errorSelector, isJokeLoading, jokeSelector } from '@/eggs/chuck-norris/selectors'
import { getPostsEgg } from '@/eggs/posts'
import { PostsPublicAction } from '@/eggs/posts/action-creators'
import { isPostsLoaded } from '@/eggs/posts/selectors'
import { getUsersEgg } from '@/eggs/users'
import { UsersPublicAction } from '@/eggs/users/action-creators'
import { isUsersLoaded } from '@/eggs/users/selectors'

import { ChuckNorrisLoading } from './loading'

const JokeContent: FC = () => {
  const isLoading = useSelector(isJokeLoading)
  const joke = useSelector(jokeSelector)
  const error = useSelector(errorSelector)

  if (isLoading) {
    return <ChuckNorrisLoading isJoke />
  }

  if (error) {
    return <p>{error}</p>
  }

  if (!joke) {
    return null
  }

  return <p>{joke}</p>
}

const UsersContent: FC = () => {
  const isLoaded = useSelector(isUsersLoaded)

  return <div>Users loading state: {isLoaded ? 'loaded' : 'loading ...'}</div>
}

const PostsContent: FC = () => {
  const isLoaded = useSelector(isPostsLoaded)

  return <div>Posts loading state: {isLoaded ? 'loaded' : 'loading ...'}</div>
}

const ChuckNorrisInjector = getInjector([getChuckNorrisEgg()])

const usersEgg = getUsersEgg()
usersEgg.afterAdd = store => store.dispatch(UsersPublicAction.loadUsers())
usersEgg.afterRemove = () => console.log('Users Egg has been removed')
const UsersInjector = getInjector([usersEgg])

const postsEgg = getPostsEgg()
postsEgg.afterAdd = store => store.dispatch(PostsPublicAction.loadPosts())
postsEgg.afterRemove = () => console.log('Posts Egg has been removed')
const PostsInjector = getInjector([postsEgg])

const Joke: FC = () => {
  return (
    <ChuckNorrisInjector.Wrapper>
      <JokeContent />
    </ChuckNorrisInjector.Wrapper>
  )
}

const Users = () => {
  return (
    <UsersInjector.Wrapper>
      <UsersContent />
    </UsersInjector.Wrapper>
  )
}

const Posts = () => {
  return (
    <PostsInjector.Wrapper>
      <PostsContent />
    </PostsInjector.Wrapper>
  )
}

export { Joke, Posts, Users }
