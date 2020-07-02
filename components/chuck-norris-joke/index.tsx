import React, { FC } from 'react'

import { useInView } from 'react-intersection-observer'
import dynamic from 'next/dynamic'
import { ChuckNorrisLoading } from './loading'

const styles = {
  fontSize: '50px',
  display: 'flex',
  padding: '30px',
  minHeight: '50vh',
  alignItems: 'center',
  justifyContent: 'center',
}

const waitAMomentPlease = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, 2000)
  })
}

const DynamicChuckNorrisJoke = dynamic<{}>(
  async () => {
    await waitAMomentPlease()

    const mod = await import('./joke')

    return mod.Joke
  },
  { ssr: false, loading: () => <ChuckNorrisLoading /> },
)

const ChuckNorrisJoke: FC = () => {
  const [ref, inView] = useInView()

  return (
    <div ref={ref} style={styles}>
      {inView && <DynamicChuckNorrisJoke />}
    </div>
  )
}

export { ChuckNorrisJoke }
