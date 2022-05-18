import type { EggTuple, RemoveAddedEggs } from '@redux-eggs/core'

export interface EggsConfigValue {
  gspOrGsspDetected?: boolean
}

export interface EggsConfig {
  __eggs?: EggTuple
  __eggsCleanup?: RemoveAddedEggs
  __eggsConfig?: EggsConfigValue
}
