import type { EggTuple } from '@redux-eggs/core'

import { getXkcdEgg } from '../xkcd'

export const getCommonEggs = (): EggTuple => {
  return [getXkcdEgg()]
}
