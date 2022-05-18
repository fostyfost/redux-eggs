import { getInjector } from '@redux-eggs/react'
import type { FC } from 'react'
import { useSelector } from 'react-redux'

import { Loading } from '../components/loading'
import { useAppDispatch } from '../store'
import { getChuckNorrisEgg } from '../store/eggs/chuck-norris'
import { loadJoke } from '../store/eggs/chuck-norris/action-creators'
import { isJokeLoading, jokeSelector } from '../store/eggs/chuck-norris/selectors'

const UpdateButton: FC = () => {
  const dispatch = useAppDispatch()

  return <button onClick={() => dispatch(loadJoke())}>Update</button>
}

const Joke: FC = () => {
  const joke = useSelector(jokeSelector)

  return (
    <>
      <p>{joke}</p>
      <UpdateButton />
    </>
  )
}

const Injector = getInjector([getChuckNorrisEgg()])

const ChuckNorrisPage: FC = () => {
  const isLoading = useSelector(isJokeLoading)

  return (
    <div style={{ background: '#C00000' }}>
      <h2>Chuck Norris</h2>
      {isLoading ? <Loading /> : <Joke />}
    </div>
  )
}

export default function Page() {
  return (
    <Injector.Wrapper>
      <ChuckNorrisPage />
    </Injector.Wrapper>
  )
}
