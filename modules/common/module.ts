import { ModuleTuple } from '@/store/contracts'
import { SagaModule } from '@/store/saga-extension/contracts'

import { getClockModule } from '../clock/module'
import { getDogModule } from '../dog/module'
import { getXkcdModule } from '../xkcd/module'
import { COMMON_MODULE_NAME } from './index'
import { commonSaga } from './saga'

export const getCommonModule = (): ModuleTuple<SagaModule<any, any>> => {
  if (process.env.NEXT_PUBLIC_DISABLE_COMMON_MODULE === 'true') {
    return []
  }

  return [
    getClockModule(),
    getXkcdModule(),
    getDogModule(),
    {
      id: COMMON_MODULE_NAME,
      sagas: [commonSaga],
    },
  ]
}
