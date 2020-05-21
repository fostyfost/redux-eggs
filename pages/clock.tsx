import React from 'react'
import { DynamicModuleLoader, IModule } from 'redux-dynamic-modules'
import { Clock } from '../components/clock'
import { getClockModule } from '../modules/clock/module'
import { NextPageWithModules } from '../contracts'

const modules = [getClockModule()]

const ClockPage: NextPageWithModules = () => {
  return (
    <DynamicModuleLoader modules={modules as IModule<any>[]}>
      <h1>Clock page</h1>
      <Clock />
    </DynamicModuleLoader>
  )
}

ClockPage.modules = modules

export default ClockPage
