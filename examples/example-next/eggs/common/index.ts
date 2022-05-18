import type { EggTuple } from '@redux-eggs/core'

import { getXkcdEgg } from '@/eggs/xkcd'

export const getCommonEgg = (): EggTuple => {
  return [getXkcdEgg()]
}
