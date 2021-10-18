import type { Store } from '@reduxjs/toolkit'

export const waitForLoadedState = async (store: Store, selector: (state: any) => boolean): Promise<void> => {
  return new Promise(resolve => {
    if (selector(store.getState())) {
      resolve()
      return
    }

    const unsubscribe = store.subscribe(() => {
      const isLoaded = selector(store.getState())

      if (isLoaded) {
        unsubscribe()
        resolve()
      }
    })
  })
}
