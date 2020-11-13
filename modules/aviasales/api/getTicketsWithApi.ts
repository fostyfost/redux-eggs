import { fetchAsJson } from '@/utils/fetchAsJson'

import { TicketsResponse } from '../contracts/api-response'

export const getTicketsWithApi = (searchId: string): Promise<TicketsResponse> => {
  return fetchAsJson(`https://front-test.beta.aviasales.ru/tickets?searchId=${searchId}`)
}
