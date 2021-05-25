import dynamic from 'next/dynamic'
import type { FC } from 'react'
import { useState } from 'react'
import { useInView } from 'react-intersection-observer'

import styles from './index.module.scss'
import { ChuckNorrisLoading } from './loading'

const waitAMomentPlease = (): Promise<void> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, 2000)
  })
}

const DynamicChuckNorrisJoke = dynamic<Record<string, unknown>>(
  async () => {
    await waitAMomentPlease()

    const mod = await import('@/components/chuck-norris-content/content')

    return mod.Joke
  },
  { ssr: false, loading: () => <ChuckNorrisLoading /> },
)

const ChuckNorrisJoke: FC = () => {
  const [ref, inView] = useInView()

  const [value, setValue] = useState(0)

  return (
    <>
      <div ref={ref} className={styles.root}>
        {inView ? <DynamicChuckNorrisJoke /> : null}
      </div>
      <div className={styles.buttonWrapper}>
        <p>{value}</p>
        <button onClick={() => setValue(prevState => prevState + 1)}>Increment</button>
      </div>
    </>
  )
}

export { ChuckNorrisJoke }
