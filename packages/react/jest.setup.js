require('@testing-library/jest-dom/extend-expect')

const originalError = console.error

beforeAll(() => {
  console.error = (...args) => {
    if (/Warning: ReactDOM.render is no longer supported in React 18./.test(args[0])) {
      return
    }

    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})
