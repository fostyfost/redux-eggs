import { fetchAsJson } from '../../../utils/fetchAsJson'
import { SearchResponse } from '../contracts/api-response'

export const getSearchIdWithApi = (): Promise<SearchResponse> => {
  return fetchAsJson('https://front-test.beta.aviasales.ru/search')
}
