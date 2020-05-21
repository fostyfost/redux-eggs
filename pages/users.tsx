import React from 'react'
import { DynamicModuleLoader, IModule } from 'redux-dynamic-modules'
import { Users } from '../components/users'
import { getUsersModule } from '../modules/users/module'
import { NextPageWithModules } from '../contracts'
import { getClockModule } from '../modules/clock/module'

const modules = [getClockModule(), getUsersModule()]

const UsersPage: NextPageWithModules = () => {
  return (
    <DynamicModuleLoader modules={modules as IModule<any>[]}>
      <h1>Users page</h1>
      <Users />
    </DynamicModuleLoader>
  )
}

UsersPage.modules = modules

export default UsersPage
