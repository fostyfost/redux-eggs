import type { TicketsResponse } from '@/eggs/aviasales/contracts/api-response'
import { fetchAsJson } from '@/utils/fetch-as-json'

export const getTicketsWithApi = (searchId: string): Promise<TicketsResponse> => {
  return fetchAsJson(`https://front-test.beta.aviasales.ru/tickets?searchId=${searchId}`)
}
