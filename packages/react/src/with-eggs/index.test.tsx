import type { Egg, EggTuple } from '@redux-eggs/core'
import { buildStore } from '@redux-eggs/core'
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { FC } from 'react'
import React from 'react'
import { Provider, useSelector } from 'react-redux'
import type { Reducer, Store } from 'redux'
import { combineReducers, compose, createStore } from 'redux'

import { withEggs } from '@/with-eggs/index'

describe('Tests for WithEggs HOC', () => {
  const getReducer =
    (initialState: any): Reducer =>
    (state = initialState) =>
      state

  type Egg1AwareState = { reducer1: { text: string } }
  type Egg2AwareState = { reducer2: { text: string } }

  const egg1: Egg = { id: 'egg1', reducersMap: { reducer1: getReducer({ text: 'find-me-1' }) } }
  const egg2: Egg = { id: 'egg2', reducersMap: { reducer2: getReducer({ text: 'find-me-2' }) } }

  const createAnyStore = () => buildStore<Store>(reducer => createStore(reducer), combineReducers, compose)

  const AnyComponent1: FC = withEggs([egg1])(function AnyComponent1() {
    const text = useSelector<Egg1AwareState, string>(state => state.reducer1.text)
    return <div>{text}</div>
  })

  const AnyComponent2: FC = withEggs([egg2])(function AnyComponent2() {
    const text = useSelector<Egg2AwareState, string>(state => state.reducer2.text)
    return <div>{text}</div>
  })

  test('HOC should add `displayName` to wrapped component', () => {
    const NamedComponent1: FC = () => null

    const NamedComponent2: FC = function NamedComponent2Fn() {
      return null
    }

    const NamedComponent3: FC = () => null
    NamedComponent3.displayName = 'NamedComponent3Fn'

    expect(withEggs([])(NamedComponent1).displayName).toBe('withEggs(NamedComponent1)')
    expect(withEggs([])(NamedComponent2).displayName).toBe('withEggs(NamedComponent2Fn)')
    expect(withEggs([])(NamedComponent3).displayName).toBe('withEggs(NamedComponent3Fn)')
    expect(withEggs([])(() => null).displayName).toBe('withEggs(Component)')
  })

  test('HOC should work correctly with mount, rerender and unmount', async () => {
    const store = createAnyStore()

    let rendersCount = 0

    const Component: FC = () => {
      const [value, setValue] = React.useState(0)
      const [isMounted1, setIsMounted1] = React.useState(true)
      const [isMounted2, setIsMounted2] = React.useState(false)

      rendersCount++

      return (
        <div>
          <button onClick={() => setValue(prevState => prevState + 1)}>{`Rerender ${value}`}</button>
          <button onClick={() => setIsMounted1(prevState => !prevState)}>{isMounted1 ? 'Unmount 1' : 'Mount 1'}</button>
          <button onClick={() => setIsMounted2(prevState => !prevState)}>{isMounted2 ? 'Unmount 2' : 'Mount 2'}</button>
          {isMounted1 ? (
            <>
              <AnyComponent1 />
              <AnyComponent2 />
            </>
          ) : null}
          {isMounted2 ? (
            <>
              <AnyComponent1 />
              <AnyComponent2 />
            </>
          ) : null}
        </div>
      )
    }

    await act(() => {
      render(
        <Provider store={store}>
          <Component />
        </Provider>,
      )
    })

    expect(rendersCount).toBe(1)
    expect(screen.getByText('Rerender 0')).toBeInTheDocument()
    expect(screen.getAllByText('find-me-1')).toHaveLength(1)
    expect(screen.getAllByText('find-me-2')).toHaveLength(1)
    expect(store.getEggCount(egg1)).toBe(1)
    expect(store.getEggCount(egg2)).toBe(1)

    await act(() => userEvent.click(screen.getByText(/Rerender 0/i)))
    await act(() => userEvent.click(screen.getByText(/Rerender 1/i)))

    expect(rendersCount).toBe(3)
    expect(screen.getByText('Rerender 2')).toBeInTheDocument()
    expect(screen.getAllByText('find-me-1')).toHaveLength(1)
    expect(screen.getAllByText('find-me-2')).toHaveLength(1)
    expect(store.getEggCount(egg1)).toBe(1)
    expect(store.getEggCount(egg2)).toBe(1)

    await act(() => userEvent.click(screen.getByText(/Mount 2/i)))

    expect(rendersCount).toBe(4)
    expect(screen.getByText('Rerender 2')).toBeInTheDocument()
    expect(screen.getAllByText('find-me-1')).toHaveLength(2)
    expect(screen.getAllByText('find-me-2')).toHaveLength(2)
    expect(store.getEggCount(egg1)).toBe(2)
    expect(store.getEggCount(egg2)).toBe(2)

    await act(() => userEvent.click(screen.getByText(/Unmount 1/i)))

    expect(rendersCount).toBe(5)
    expect(screen.getByText('Rerender 2')).toBeInTheDocument()
    expect(screen.getAllByText('find-me-1')).toHaveLength(1)
    expect(screen.getAllByText('find-me-2')).toHaveLength(1)
    expect(store.getEggCount(egg1)).toBe(1)
    expect(store.getEggCount(egg2)).toBe(1)

    await act(() => userEvent.click(screen.getByText(/Unmount 2/i)))

    expect(rendersCount).toBe(6)
    expect(screen.getByText('Rerender 2')).toBeInTheDocument()
    expect(screen.queryByText('find-me-1')).not.toBeInTheDocument()
    expect(screen.queryByText('find-me-2')).not.toBeInTheDocument()
    expect(store.getEggCount(egg1)).toBe(0)
    expect(store.getEggCount(egg2)).toBe(0)
  })

  test('HOC should support React Strict Mode', async () => {
    const store = createAnyStore()

    let rendersCount = 0

    const Component: FC = () => {
      const [isMounted1, setIsMounted1] = React.useState(true)
      const [isMounted2, setIsMounted2] = React.useState(false)

      rendersCount++

      return (
        <div>
          <button onClick={() => setIsMounted1(prevState => !prevState)}>{isMounted1 ? 'Unmount 1' : 'Mount 1'}</button>
          <button onClick={() => setIsMounted2(prevState => !prevState)}>{isMounted2 ? 'Unmount 2' : 'Mount 2'}</button>
          {isMounted1 ? (
            <>
              <AnyComponent1 />
              <AnyComponent2 />
            </>
          ) : null}
          {isMounted2 ? (
            <>
              <AnyComponent1 />
              <AnyComponent2 />
            </>
          ) : null}
        </div>
      )
    }

    await act(() => {
      render(
        <React.StrictMode>
          <Provider store={store}>
            <Component />
          </Provider>
        </React.StrictMode>,
      )
    })

    expect(rendersCount).toBe(2)
    expect(screen.getAllByText('find-me-1')).toHaveLength(1)
    expect(screen.getAllByText('find-me-2')).toHaveLength(1)
    expect(store.getEggCount(egg1)).toBe(1)
    expect(store.getEggCount(egg2)).toBe(1)

    await act(() => userEvent.click(screen.getByText(/Mount 2/i)))

    expect(rendersCount).toBe(4)
    expect(screen.getAllByText('find-me-1')).toHaveLength(2)
    expect(screen.getAllByText('find-me-2')).toHaveLength(2)
    expect(store.getEggCount(egg1)).toBe(2)
    expect(store.getEggCount(egg2)).toBe(2)

    await act(() => userEvent.click(screen.getByText(/Unmount 1/i)))

    expect(rendersCount).toBe(6)
    expect(screen.getAllByText('find-me-1')).toHaveLength(1)
    expect(screen.getAllByText('find-me-2')).toHaveLength(1)
    expect(store.getEggCount(egg1)).toBe(1)
    expect(store.getEggCount(egg2)).toBe(1)

    await act(() => userEvent.click(screen.getByText(/Unmount 2/i)))

    expect(rendersCount).toBe(8)
    expect(screen.queryByText('find-me-1')).not.toBeInTheDocument()
    expect(screen.queryByText('find-me-2')).not.toBeInTheDocument()
    expect(store.getEggCount(egg1)).toBe(0)
    expect(store.getEggCount(egg2)).toBe(0)
  })

  test('HOC should clean up eggs', async () => {
    const store = createAnyStore()
    const originalAddEggs = store.addEggs

    const spyOnAddEggs = jest.spyOn(store, 'addEggs')
    const spyOnRemoveEggs = jest.spyOn(store, 'removeEggs')

    spyOnAddEggs.mockImplementation((eggs: EggTuple) => {
      originalAddEggs(eggs)
      return () => store.removeEggs(eggs)
    })

    expect(spyOnAddEggs).not.toBeCalled()
    expect(spyOnRemoveEggs).not.toBeCalled()
    expect(store.getEggCount(egg1)).toBe(0)

    const Component: FC = () => {
      const [isMounted, setIsMounted] = React.useState(true)

      return (
        <div>
          <button onClick={() => setIsMounted(prevState => !prevState)}>{isMounted ? 'Unmount' : 'Mount'}</button>
          {isMounted ? <AnyComponent1 /> : null}
        </div>
      )
    }

    render(
      <Provider store={store}>
        <Component />
      </Provider>,
    )

    expect(spyOnAddEggs).toBeCalledTimes(1)
    expect(spyOnAddEggs).toBeCalledWith([egg1])
    expect(spyOnRemoveEggs).not.toBeCalled()
    expect(store.getEggCount(egg1)).toBe(1)

    spyOnAddEggs.mockClear()

    await act(() => userEvent.click(screen.getByText(/Unmount/i)))

    expect(spyOnAddEggs).not.toBeCalled()
    expect(spyOnRemoveEggs).toBeCalledTimes(1)
    expect(spyOnRemoveEggs).toBeCalledWith([egg1])
    expect(store.getEggCount(egg1)).toBe(0)
  })
})
