import type { AppWrapperOptions } from '@redux-eggs/next'
import type { AppProps } from 'next/app'
import NextApp from 'next/app'
import { END } from 'redux-saga'

import { Layout } from '@/components/layout'
import { getCommonEgg } from '@/eggs/common'
import type { AppStore } from '@/store'
import { wrapperInitializer } from '@/store'
import { StoreActionType } from '@/store/action-types'
import { allSagasDone } from '@/store/all-sagas-done'

const CustomApp = ({ Component, pageProps }: AppProps) => {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}

const options: AppWrapperOptions<AppStore> = {}

if (typeof window === 'undefined') {
  options.beforeResult = async store => {
    store.dispatch({ type: StoreActionType.STOP_ALL_TASKS })

    store.dispatch(END)

    await allSagasDone(store.getSagaTasks())
  }
}

const wrapper = wrapperInitializer.getAppWrapper([getCommonEgg()], options)

CustomApp.getInitialProps = wrapper.wrapGetInitialProps(() => appContext => NextApp.getInitialProps(appContext))

export default wrapper.wrapApp(CustomApp)
