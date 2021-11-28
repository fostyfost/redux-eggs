import type { EggTuple } from '@redux-eggs/core'

import { getXkcdEgg } from '@/eggs/xkcd'
import type { AppStore } from '@/store'

export const getCommonEgg = (): EggTuple<AppStore> => {
  return [getXkcdEgg()]
}
