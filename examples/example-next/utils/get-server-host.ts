export const getServerHost = () => {
  return `http://localhost${process.env.PORT ? `:${process.env.PORT}` : ''}`
}
