import type { EggTuple, RemoveAddedEggs } from '@redux-eggs/core'
import type { EggExt } from '@redux-eggs/core'
import type { FC, PropsWithChildren } from 'react'
import { createElement, Fragment, useEffect } from 'react'
import { useStore } from 'react-redux'

import type { InjectorResult } from '@/contracts'

export const getInjector = (eggs: EggTuple): InjectorResult => {
  return Object.defineProperty<InjectorResult>({} as InjectorResult, 'Wrapper', {
    get() {
      let removeFn: RemoveAddedEggs | undefined

      const Wrapper: FC<PropsWithChildren> = ({ children }) => {
        const store = useStore() as ReturnType<typeof useStore> & EggExt

        if (!removeFn) {
          const remover = store.addEggs(eggs)

          removeFn = () => {
            remover()
            removeFn = undefined
          }
        }

        useEffect(() => removeFn, [])

        return createElement(Fragment, null, children)
      }

      Wrapper.displayName = 'withEggs(Injector)'

      return Wrapper
    },
  })
}
