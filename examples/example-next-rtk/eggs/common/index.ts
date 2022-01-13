import type { EggTuple } from '@redux-eggs/core'

import { getCountEgg } from '@/eggs/count'
import { getXkcdEgg } from '@/eggs/xkcd'
import type { AppStore } from '@/store'

export const getCommonEgg = (): EggTuple<AppStore> => {
  return [getXkcdEgg(), getCountEgg()]
}
