import type { SearchResponse } from '@/modules/aviasales/contracts/api-response'
import { fetchAsJson } from '@/utils/fetchAsJson'

export const getSearchIdWithApi = (): Promise<SearchResponse> => {
  return fetchAsJson('https://front-test.beta.aviasales.ru/search')
}
