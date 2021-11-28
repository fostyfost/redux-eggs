import type { SearchResponse } from '@/eggs/aviasales/contracts/api-response'
import { fetchAsJson } from '@/utils/fetch-as-json'

export const getSearchIdWithApi = (): Promise<SearchResponse> => {
  return fetchAsJson('https://front-test.beta.aviasales.ru/search')
}
