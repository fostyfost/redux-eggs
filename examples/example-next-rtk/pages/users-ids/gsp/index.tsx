import type { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next'
import Head from 'next/head'

import { UsersIds } from '@/components/users-ids'
import { getUsersEgg } from '@/eggs/users'
import { UsersPublicAction } from '@/eggs/users/slice'
import { wrapperInitializer } from '@/store'

interface Props {
  title: string
}

const UsersIdsPage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({ title }) => {
  return (
    <div>
      <Head>
        <title>{title}</title>
      </Head>
      <h1>{title}</h1>
      <UsersIds rootUrl='/users-ids/gsp' />
    </div>
  )
}

const wrapper = wrapperInitializer.getPageWrapper([getUsersEgg()])

export const getStaticProps: GetStaticProps<Props> = wrapper.wrapGetStaticProps(store => () => {
  store.dispatch(UsersPublicAction.loadUsers())

  return {
    props: {
      title: 'Users IDs page (with Get Static Props)',
    },
  }
})

export default wrapper.wrapPage(UsersIdsPage)
