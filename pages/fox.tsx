import dynamic from 'next/dynamic'
import Head from 'next/head'

import { withDynamicModuleLoader } from '@/components/common/with-dynamic-module-loader'
import { getFoxModule } from '@/modules/fox/module'
import { NextPageWithStore } from '@/store/contracts'

const Fox = dynamic<Record<string, unknown>>(() => import('../components/fox').then(mod => mod.Fox), { ssr: true })

interface Props {
  title: string
  isFoxModuleEnabled: boolean
}

const FoxPage: NextPageWithStore<Props, Props> = ({ title, isFoxModuleEnabled }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div>
        <h1>{title}</h1>
        {isFoxModuleEnabled ? <Fox /> : <p>Module disabled</p>}
      </div>
    </>
  )
}

FoxPage.getInitialProps = async context => {
  return {
    title: 'Fox page',
    isFoxModuleEnabled: context.query?.isFoxModuleEnabled !== 'false',
  }
}

export default withDynamicModuleLoader(FoxPage, [getFoxModule()])
