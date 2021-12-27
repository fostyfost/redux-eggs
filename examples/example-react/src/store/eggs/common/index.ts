import type { EggTuple } from '@redux-eggs/core'

import type { AppStore } from '../../index'
import { getXkcdEgg } from '../xkcd'

export const getCommonEggs = (): EggTuple<AppStore> => {
  return [getXkcdEgg()]
}
