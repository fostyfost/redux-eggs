import type { FC } from 'react'

const ChuckNorrisLoading: FC<{ isJoke?: boolean }> = ({ isJoke }) => {
  return <p>Load Chuck Norris {isJoke ? 'joke' : 'chunk'} ...</p>
}

export { ChuckNorrisLoading }
