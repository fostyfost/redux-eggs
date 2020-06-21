import { AppPropsType } from 'next/dist/next-server/lib/utils'
import React, { FC } from 'react'

import { Layout } from '../components/layout'
import { getCommonModule } from '../modules/common/module'
import { withRedux } from '../store'

const App: FC<AppPropsType> = ({ Component, pageProps }) => {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}

export default withRedux(App, [getCommonModule()])
