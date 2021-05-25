import type { InferGetStaticPropsType, NextPage } from 'next'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import React, { useState } from 'react'

import { wrapperInitializer } from '@/store'

const Joke = dynamic<any>(
  () => {
    return import('@/components/chuck-norris-content/content').then(mod => mod.Joke)
  },
  { ssr: false },
)

const Users = dynamic<any>(
  () => {
    return import('@/components/chuck-norris-content/content').then(mod => mod.Users)
  },
  { ssr: false },
)

const Posts = dynamic<any>(
  () => {
    return import('@/components/chuck-norris-content/content').then(mod => mod.Posts)
  },
  { ssr: false },
)

const ChuckNorrisPage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({ title }) => {
  const [value, setValue] = useState(0)

  const [mods, setMods] = useState<Record<string, boolean>>({
    joke1: true,
    joke2: true,
    users1: true,
    users2: true,
    posts1: true,
    posts2: true,
  })

  return (
    <div>
      <Head>
        <title>{title}</title>
      </Head>
      <h1>{title}</h1>

      <div>
        <p>{value}</p>
        <button onClick={() => setValue(prevState => prevState + 1)}>Increment</button>
      </div>

      <div>
        {Object.entries(mods).map(([key, value]) => {
          return (
            <button key={key} onClick={() => setMods(prev => ({ ...prev, [key]: !prev[key] }))}>
              {key} {value ? 'on' : 'off'}
            </button>
          )
        })}
      </div>

      <div>{mods.joke1 ? <Joke /> : null}</div>
      <div>{mods.joke2 ? <Joke /> : null}</div>

      <div>{mods.users1 ? <Users /> : null}</div>
      <div>{mods.users2 ? <Users /> : null}</div>

      <div>{mods.posts1 ? <Posts /> : null}</div>
      <div>{mods.posts2 ? <Posts /> : null}</div>
    </div>
  )
}

const wrapper = wrapperInitializer.getPageWrapper()

export const getStaticProps = wrapper.wrapGetStaticProps({ title: 'Chuck Norris page (with Get Static Props)' })

export default wrapper.wrapPage(ChuckNorrisPage)
