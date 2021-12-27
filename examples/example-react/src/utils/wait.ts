export const wait = (timeout = 1000): Promise<void> => {
  return new Promise<void>(resolve => {
    setTimeout(() => resolve(), timeout)
  })
}
