import { getInjector } from '@redux-eggs/react'
import type { FC } from 'react'
import { useCallback } from 'react'
import { useSelector } from 'react-redux'

import { Loading } from '../components/loading'
import { useAppDispatch } from '../store'
import { getChuckNorrisEgg } from '../store/eggs/chuck-norris'
import { loadJoke } from '../store/eggs/chuck-norris/action-creators'
import { isJokeLoading, jokeSelector } from '../store/eggs/chuck-norris/selectors'

const Joke: FC = () => {
  const joke = useSelector(jokeSelector)

  const dispatch = useAppDispatch()

  const handleUpdate = useCallback(() => {
    dispatch(loadJoke())
  }, [dispatch])

  return (
    <>
      <p>{joke}</p>
      <div>
        <button onClick={handleUpdate}>Update</button>
      </div>
    </>
  )
}

const Content: FC = () => {
  const isLoading = useSelector(isJokeLoading)

  return (
    <div style={{ background: '#C00000' }}>
      <h2>Chuck Norris</h2>
      {isLoading ? <Loading /> : <Joke />}
    </div>
  )
}

const ChuckNorrisInjector = getInjector([getChuckNorrisEgg()])

const ChuckNorrisPage: FC = () => {
  return (
    <ChuckNorrisInjector.Wrapper>
      <Content />
    </ChuckNorrisInjector.Wrapper>
  )
}

export default ChuckNorrisPage
