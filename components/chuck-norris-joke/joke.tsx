import React, { FC } from 'react'
import { useSelector } from 'react-redux'

import { getChuckNorrisModule } from '../../modules/chuck-norris/module'
import { errorSelector, isJokeLoading, jokeSelector } from '../../modules/chuck-norris/selectors'
import { DynamicModuleLoader } from '../common/dynamic-module-loader'
import { ChuckNorrisLoading } from './loading'

const Content: FC = () => {
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

const Joke: FC = () => {
  return (
    <DynamicModuleLoader modules={[getChuckNorrisModule()]}>
      <Content />
    </DynamicModuleLoader>
  )
}

export { Joke }
