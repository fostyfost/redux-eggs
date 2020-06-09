import { IModuleTuple } from '../../components/common/dynamic-module-loader'
import { getClockModule } from '../clock/module'
import { getXkcdModule } from '../xkcd/module'
import { ISagaModule } from '../../store/saga-extension/contracts'
import { COMMON_MODULE_NAME } from './index'
import { commonSaga } from './saga'

export const getCommonModule = (): IModuleTuple<ISagaModule<any, any>> => {
  return [
    getClockModule(),
    getXkcdModule(),
    {
      id: COMMON_MODULE_NAME,
      sagas: [commonSaga],
    },
  ]
}
