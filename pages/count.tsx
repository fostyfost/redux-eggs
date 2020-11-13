import Head from 'next/head'

import { withDynamicModuleLoader } from '@/components/common/with-dynamic-module-loader'
import { Count } from '@/components/count'
import { getCountModule } from '@/modules/count/module'
import { NextPageWithStore } from '@/store/contracts'

interface Props {
  title: string
}

const CountPage: NextPageWithStore<Props, Props> = ({ title }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div>
        <h1>{title}</h1>
        <Count />
      </div>
    </>
  )
}

CountPage.getInitialProps = () => {
  return { title: 'Count page' }
}

export default withDynamicModuleLoader(CountPage, [getCountModule()])
