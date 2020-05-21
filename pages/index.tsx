import React from 'react'
import { DynamicModuleLoader, IModule } from 'redux-dynamic-modules'
import { NextPageWithModules } from '../contracts'
import { getClockModule } from '../modules/clock/module'

const modules = [getClockModule()]

const IndexPage: NextPageWithModules = () => {
  return (
    <DynamicModuleLoader modules={modules as IModule<any>[]}>
      <h1>Index page</h1>
    </DynamicModuleLoader>
  )
}

IndexPage.modules = modules

export default IndexPage
