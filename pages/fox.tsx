import dynamic from 'next/dynamic'
import Head from 'next/head'

import { withDynamicModuleLoader } from '@/components/common/with-dynamic-module-loader'
import { FoxPublicAction } from '@/modules/fox/action-creators'
import { getFoxModule } from '@/modules/fox/module'
import type { NextPageWithStore } from '@/store/contracts'

const Fox = dynamic<Record<string, unknown>>(() => import('@/components/fox').then(mod => mod.Fox), { ssr: true })

interface Props {
  title: string
}

const FoxPage: NextPageWithStore<Props, Props> = ({ title }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div>
        <h1>{title}</h1>
        <Fox />
      </div>
    </>
  )
}

FoxPage.getInitialProps = context => {
  context.store.dispatch(FoxPublicAction.loadFox())

  return { title: 'Fox page' }
}

export default withDynamicModuleLoader(FoxPage, [getFoxModule()])
