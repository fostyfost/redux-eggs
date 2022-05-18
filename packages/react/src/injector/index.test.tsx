import type { Egg } from '@redux-eggs/core'
import { createStore } from '@redux-eggs/redux'
import { act, cleanup, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as React from 'react'
import { Provider, useSelector } from 'react-redux'
import type { Reducer } from 'redux'

import type { InjectorResult } from '@/contracts'
import { getInjector } from '@/injector'
import { getInjector as getLegacyInjector } from '@/injector/legacy'

describe('Tests for Eggs Injector Component', () => {
  function getReducer(initialState: any): Reducer {
    return function reducer(state = initialState) {
      return state
    }
  }

  type Egg1AwareState = { reducer1: { text: string } }
  type Egg2AwareState = { reducer2: { text: string } }

  const egg1: Egg = { id: 'egg1', reducersMap: { reducer1: getReducer({ text: 'find-me-1' }) } }
  const egg2: Egg = { id: 'egg2', reducersMap: { reducer2: getReducer({ text: 'find-me-2' }) } }

  const AnyComponent1: React.FC = () => {
    const text = useSelector<Egg1AwareState, string>(state => state.reducer1.text)
    return <div>{text}</div>
  }

  const AnyComponent2: React.FC = () => {
    const text = useSelector<Egg2AwareState, string>(state => state.reducer2.text)
    return <div>{text}</div>
  }

  test('`getInjector` should return object with `FC`', () => {
    expect(getInjector([]).Wrapper).toEqual(expect.any(Function))
    expect(getLegacyInjector([]).Wrapper).toEqual(expect.any(Function))
  })

  test('`Injector.Wrapper` should have `displayName`', () => {
    const expectedDisplayName = 'withEggs(Injector)'

    expect(getInjector([]).Wrapper.displayName).toEqual(expectedDisplayName)
    expect(getLegacyInjector([]).Wrapper.displayName).toEqual(expectedDisplayName)
  })

  test('Injector should work correctly with mount, rerender and unmount', async () => {
    const runWith = async (Injector: InjectorResult, legacyRoot?: boolean) => {
      const store = createStore()

      let rendersCount = 0

      const Component: React.FC = () => {
        const [value, setValue] = React.useState(0)
        const [isMounted1, setIsMounted1] = React.useState(true)
        const [isMounted2, setIsMounted2] = React.useState(false)

        rendersCount++

        return (
          <div>
            <button onClick={() => setValue(prevState => prevState + 1)}>{`Rerender ${value}`}</button>
            <button onClick={() => setIsMounted1(prevState => !prevState)}>
              {isMounted1 ? 'Unmount 1' : 'Mount 1'}
            </button>
            <button onClick={() => setIsMounted2(prevState => !prevState)}>
              {isMounted2 ? 'Unmount 2' : 'Mount 2'}
            </button>
            {isMounted1 ? (
              <Injector.Wrapper>
                <AnyComponent1 />
                <AnyComponent2 />
              </Injector.Wrapper>
            ) : null}
            {isMounted2 ? (
              <Injector.Wrapper>
                <AnyComponent1 />
                <AnyComponent2 />
              </Injector.Wrapper>
            ) : null}
          </div>
        )
      }

      const user = userEvent.setup()

      const { getByText, getAllByText, queryByText } = render(
        <Provider store={store}>
          <Component />
        </Provider>,
        { legacyRoot },
      )

      expect(rendersCount).toBe(1)
      expect(getByText('Rerender 0')).toBeInTheDocument()
      expect(getAllByText('find-me-1')).toHaveLength(1)
      expect(getAllByText('find-me-2')).toHaveLength(1)
      expect(store.getEggCount(egg1)).toBe(1)
      expect(store.getEggCount(egg2)).toBe(1)

      await act(() => user.click(getByText(/Rerender 0/i)))
      await act(() => user.click(getByText(/Rerender 1/i)))

      expect(rendersCount).toBe(3)
      expect(getByText('Rerender 2')).toBeInTheDocument()
      expect(getAllByText('find-me-1')).toHaveLength(1)
      expect(getAllByText('find-me-2')).toHaveLength(1)
      expect(store.getEggCount(egg1)).toBe(1)
      expect(store.getEggCount(egg2)).toBe(1)

      await act(() => user.click(getByText(/Mount 2/i)))

      expect(rendersCount).toBe(4)
      expect(getByText('Rerender 2')).toBeInTheDocument()
      expect(getAllByText('find-me-1')).toHaveLength(2)
      expect(getAllByText('find-me-2')).toHaveLength(2)
      expect(store.getEggCount(egg1)).toBe(2)
      expect(store.getEggCount(egg2)).toBe(2)

      await act(() => user.click(getByText(/Unmount 1/i)))

      expect(rendersCount).toBe(5)
      expect(getByText('Rerender 2')).toBeInTheDocument()
      expect(getAllByText('find-me-1')).toHaveLength(1)
      expect(getAllByText('find-me-2')).toHaveLength(1)
      expect(store.getEggCount(egg1)).toBe(1)
      expect(store.getEggCount(egg2)).toBe(1)

      await act(() => user.click(getByText(/Unmount 2/i)))

      expect(rendersCount).toBe(6)
      expect(getByText('Rerender 2')).toBeInTheDocument()
      expect(queryByText('find-me-1')).not.toBeInTheDocument()
      expect(queryByText('find-me-2')).not.toBeInTheDocument()
      expect(store.getEggCount(egg1)).toBe(0)
      expect(store.getEggCount(egg2)).toBe(0)
    }

    const eggs = [egg1, egg2]

    await runWith(getInjector(eggs))

    cleanup()

    await runWith(getInjector(eggs), true)
  })

  test('Injector should support React Strict Mode', async () => {
    const runWith = async (Injector: InjectorResult, legacyRoot?: boolean) => {
      const store = createStore()

      let rendersCount = 0

      const Component: React.FC = () => {
        const [isMounted1, setIsMounted1] = React.useState(true)
        const [isMounted2, setIsMounted2] = React.useState(false)

        rendersCount++

        return (
          <div>
            <button onClick={() => setIsMounted1(prevState => !prevState)}>
              {isMounted1 ? 'Unmount 1' : 'Mount 1'}
            </button>
            <button onClick={() => setIsMounted2(prevState => !prevState)}>
              {isMounted2 ? 'Unmount 2' : 'Mount 2'}
            </button>
            {isMounted1 ? (
              <Injector.Wrapper>
                <AnyComponent1 />
                <AnyComponent2 />
              </Injector.Wrapper>
            ) : null}
            {isMounted2 ? (
              <Injector.Wrapper>
                <AnyComponent1 />
                <AnyComponent2 />
              </Injector.Wrapper>
            ) : null}
          </div>
        )
      }

      const user = userEvent.setup()

      const { getByText, getAllByText, queryByText } = render(
        <React.StrictMode>
          <Provider store={store}>
            <Component />
          </Provider>
        </React.StrictMode>,
        { legacyRoot },
      )

      expect(rendersCount).toBe(2)
      expect(getAllByText('find-me-1')).toHaveLength(1)
      expect(getAllByText('find-me-2')).toHaveLength(1)
      expect(store.getEggCount(egg1)).toBe(1)
      expect(store.getEggCount(egg2)).toBe(1)

      await act(() => user.click(getByText(/Mount 2/i)))

      expect(rendersCount).toBe(4)
      expect(getAllByText('find-me-1')).toHaveLength(2)
      expect(getAllByText('find-me-2')).toHaveLength(2)
      expect(store.getEggCount(egg1)).toBe(2)
      expect(store.getEggCount(egg2)).toBe(2)

      await act(() => user.click(getByText(/Unmount 1/i)))

      expect(rendersCount).toBe(6)
      expect(getAllByText('find-me-1')).toHaveLength(1)
      expect(getAllByText('find-me-2')).toHaveLength(1)
      expect(store.getEggCount(egg1)).toBe(1)
      expect(store.getEggCount(egg2)).toBe(1)

      await act(() => user.click(getByText(/Unmount 2/i)))

      expect(rendersCount).toBe(8)
      expect(queryByText('find-me-1')).not.toBeInTheDocument()
      expect(queryByText('find-me-2')).not.toBeInTheDocument()
      expect(store.getEggCount(egg1)).toBe(0)
      expect(store.getEggCount(egg2)).toBe(0)
    }

    const eggs = [egg1, egg2]

    await runWith(getInjector(eggs))

    cleanup()

    await runWith(getLegacyInjector(eggs), true)
  })

  test('Injector should clean up eggs', async () => {
    const runWith = async (Injector: InjectorResult, legacyRoot?: boolean) => {
      const store = createStore()

      const Component: React.FC = () => {
        const [isMounted, setIsMounted] = React.useState(true)

        return (
          <div>
            <button onClick={() => setIsMounted(prevState => !prevState)}>{isMounted ? 'Unmount' : 'Mount'}</button>
            {isMounted ? (
              <Injector.Wrapper>
                <AnyComponent1 />
              </Injector.Wrapper>
            ) : null}
          </div>
        )
      }

      const user = userEvent.setup()

      const { getByText } = render(
        <Provider store={store}>
          <Component />
        </Provider>,
        { legacyRoot },
      )

      expect(store.getEggCount(egg1)).toBe(1)

      await act(() => user.click(getByText(/Unmount/i)))

      expect(store.getEggCount(egg1)).toBe(0)
    }

    const eggs = [egg1]

    await runWith(getInjector(eggs))

    cleanup()

    await runWith(getInjector(eggs), true)
  })
})
