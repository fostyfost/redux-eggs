import type { BeforeResult } from '@redux-eggs/next'
import type { AppType } from 'next/dist/shared/lib/utils'
import { END } from 'redux-saga'

import { Layout } from '@/components/layout'
import { getCommonEgg } from '@/eggs/common'
import type { AppStore } from '@/store'
import { wrapperInitializer } from '@/store'
import { StoreActionType } from '@/store/action-types'
import { allSagasDone } from '@/store/all-sagas-done'

const CustomApp: AppType = ({ Component, pageProps }) => {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}

const beforeResult: BeforeResult<AppStore> = async store => {
  if (typeof window === 'undefined') {
    store.dispatch({ type: StoreActionType.STOP_ALL_TASKS })

    store.dispatch(END)

    await allSagasDone(store.getSagaTasks())
  }
}

const wrapper = wrapperInitializer.getAppWrapper([getCommonEgg()], { beforeResult })

export default wrapper.wrapApp(CustomApp)
