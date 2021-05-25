import type { EggExt, EggTuple, RemoveAddedEggs } from '@redux-eggs/core'
import type { FC } from 'react'
import React from 'react'
import { useStore } from 'react-redux'
import type { Store } from 'redux'

// TODO: Check React 18 compat

export interface InjectorResult {
  Wrapper: FC
}

export const getInjector = (eggs: EggTuple): InjectorResult => {
  return Object.defineProperty<InjectorResult>({} as InjectorResult, 'Wrapper', {
    get() {
      let removeFn: RemoveAddedEggs | undefined

      const Wrapper: FC = ({ children }) => {
        const store = useStore() as Store & EggExt

        if (!removeFn) {
          const remover = store.addEggs(eggs)

          removeFn = () => {
            remover()
            removeFn = undefined
          }
        }

        React.useEffect(() => removeFn, [])

        return <>{children}</>
      }

      Wrapper.displayName = 'EggsInjectorWrapper'

      return Wrapper
    },
  })
}
