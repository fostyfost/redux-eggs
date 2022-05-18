import type { EggTuple } from '@redux-eggs/core'
import type { FC } from 'react'
import { createElement } from 'react'

import type { WithEggsReturnType } from '@/contracts'
import { getInjector } from '@/injector/legacy'

// Note: add https://github.com/mridgway/hoist-non-react-statics

export function withEggs(eggs: EggTuple): WithEggsReturnType {
  const Injector = getInjector(eggs)

  return Component => {
    const WithEggs: FC<any> = props => {
      return createElement(Injector.Wrapper, null, createElement<any>(Component, props))
    }

    WithEggs.displayName = 'withEggs(' + (Component.displayName || Component.name || 'Component') + ')'

    return WithEggs
  }
}
