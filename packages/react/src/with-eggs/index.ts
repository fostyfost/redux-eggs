import type { EggExt, EggTuple, RemoveAddedEggs } from '@redux-eggs/core'
import type { FC } from 'react'
import { createElement, useEffect, useState } from 'react'
import { useStore } from 'react-redux'

import type { GetLibraryManagedProps, WithEggsReturnType } from '@/contracts'

// Note: add https://github.com/mridgway/hoist-non-react-statics

export function withEggs(eggs: EggTuple): WithEggsReturnType {
  return Component => {
    const removers: RemoveAddedEggs[] = []

    const WithEggs: FC<GetLibraryManagedProps<typeof Component>> = props => {
      const store = useStore() as ReturnType<typeof useStore> & EggExt

      useState(() => removers.push(store.addEggs(eggs)))

      useEffect(() => removers.pop(), [])

      return createElement<any>(Component, props)
    }

    WithEggs.displayName = 'withEggs(' + (Component.displayName || Component.name || 'Component') + ')'

    return WithEggs
  }
}
