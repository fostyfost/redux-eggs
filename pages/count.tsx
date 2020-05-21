import React from 'react'
import { DynamicModuleLoader, IModule } from 'redux-dynamic-modules'
import { Count } from '../components/count'
import { getCountModule } from '../modules/count/module'
import { NextPageWithModules } from '../contracts'
import { getClockModule } from '../modules/clock/module'

const modules = [getClockModule(), getCountModule()]

const CountPage: NextPageWithModules = () => {
  return (
    <DynamicModuleLoader modules={modules as IModule<any>[]}>
      <h1>Count page</h1>
      <Count />
    </DynamicModuleLoader>
  )
}

CountPage.modules = modules

export default CountPage
