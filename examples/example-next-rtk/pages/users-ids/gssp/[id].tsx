import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next'
import Head from 'next/head'

import { User } from '@/components/user'
import { UsersIds } from '@/components/users-ids'
import { getUsersEgg } from '@/eggs/users'
import { getUserById, isUsersLoaded } from '@/eggs/users/selectors'
import { UsersPublicAction } from '@/eggs/users/slice'
import { wrapperInitializer } from '@/store'
import { waitForLoadedState } from '@/store/wait-for-loaded-state'

interface Props {
  title: string
  id: number
}

const UserPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ title, id }) => {
  const localTitle = `${title} (with Get Server-side Props)`

  return (
    <div>
      <Head>
        <title>{localTitle}</title>
      </Head>
      <h1>{localTitle}</h1>
      <UsersIds rootUrl='/users-ids/gssp' />
      <User id={id} />
    </div>
  )
}

const wrapper = wrapperInitializer.getPageWrapper([getUsersEgg()])

export const getServerSideProps: GetServerSideProps<Props> = wrapper.wrapGetServerSideProps(store => async context => {
  const id = Number(context.params?.id)

  if (!id) {
    return {
      notFound: true,
    }
  }

  store.dispatch(UsersPublicAction.loadUsers())

  await waitForLoadedState(store, isUsersLoaded)

  const user = getUserById(store.getState(), id)

  if (!user) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      title: `This is page of user with ID: ${id}`,
      id,
    },
  }
})

export default wrapper.wrapPage(UserPage)
