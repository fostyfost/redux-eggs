import type { EggTuple } from '@redux-eggs/redux-toolkit'

import { getXkcdEgg } from '@/eggs/xkcd'

export const getCommonEgg = (): EggTuple => {
  return [getXkcdEgg()]
}
