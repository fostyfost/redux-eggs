import type { EggTuple } from '@redux-eggs/core'
import type { ComponentType, FC } from 'react'
import React from 'react'

import { getInjector } from '@/injector'

export type WithEggsReturnType<P = Record<string, never>> = (Component: ComponentType<P>) => FC<P>

// Note: add https://github.com/mridgway/hoist-non-react-statics

export function withEggs<P = Record<string, never>>(eggs: EggTuple<any>): WithEggsReturnType<P> {
  const Injector = getInjector(eggs)

  return Component => {
    const WithEggs: FC<P> = props => {
      return (
        <Injector.Wrapper>
          <Component {...props} />
        </Injector.Wrapper>
      )
    }

    WithEggs.displayName = `withEggs(${Component.displayName || Component.name || 'Component'})`

    return WithEggs
  }
}
