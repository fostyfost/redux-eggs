import type { EggTuple } from '@redux-eggs/core'

import { getCountEgg } from '@/eggs/count'
import { getXkcdEgg } from '@/eggs/xkcd'

export const getCommonEgg = (): EggTuple => {
  return [getXkcdEgg(), getCountEgg()]
}
