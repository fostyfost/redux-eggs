import type { EggTuple } from '@redux-eggs/core'

export interface EggsConfigValue {
  gspOrGsspDetected?: boolean
}

export interface EggsConfig {
  __eggs?: EggTuple
  __eggsConfig?: EggsConfigValue
}
