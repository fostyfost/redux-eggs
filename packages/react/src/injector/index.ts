import type { EggTuple } from '@redux-eggs/core'
import type { FC, PropsWithChildren } from 'react'
import { createElement, Fragment } from 'react'

import type { InjectorResult } from '@/contracts'
import { withEggs } from '@/with-eggs'

export const getInjector = (eggs: EggTuple): InjectorResult => {
  const Wrapper: FC<PropsWithChildren> = withEggs(eggs)(function Injector({ children }: PropsWithChildren) {
    return createElement(Fragment, null, children)
  })

  return { Wrapper }
}
