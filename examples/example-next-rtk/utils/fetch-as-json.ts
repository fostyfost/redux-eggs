export const fetchAsJson = async <R = any>(input: RequestInfo, init?: RequestInit): Promise<R> => {
  const res = await fetch(input, init)
  return await res.json()
}
