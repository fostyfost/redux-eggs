import type { Egg, EggTuple } from '@redux-eggs/core'
import { createStore } from '@redux-eggs/redux'
import { act, cleanup, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as React from 'react'
import { Provider, useSelector } from 'react-redux'
import type { Reducer } from 'redux'

import type { WithEggsReturnType } from '@/contracts'
import { withEggs } from '@/with-eggs'
import { withEggs as withEggsLegacy } from '@/with-eggs/legacy'

describe('Tests for WithEggs HOC', () => {
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

  test('HOC should add `displayName` to wrapped component', () => {
    const runWith = (hoc: (eggs: EggTuple) => WithEggsReturnType) => {
      expect(hoc([])(() => null).displayName).toBe('withEggs(Component)')

      {
        const NamedComponent: React.FC = () => {
          return null
        }

        expect(hoc([])(NamedComponent).displayName).toBe('withEggs(NamedComponent)')
      }

      {
        const NamedComponent: React.FC = function NamedComponentFn() {
          return null
        }

        expect(hoc([])(NamedComponent).displayName).toBe('withEggs(NamedComponentFn)')
      }

      {
        const NamedComponent: React.FC = () => {
          return null
        }

        NamedComponent.displayName = 'NamedComponentFn'

        expect(hoc([])(NamedComponent).displayName).toBe('withEggs(NamedComponentFn)')
      }
    }

    runWith(withEggs)
    runWith(withEggsLegacy)
  })

  test('HOC should work correctly with mount, rerender and unmount', async () => {
    const runWith = async (hoc: (eggs: EggTuple) => WithEggsReturnType, legacyRoot?: boolean) => {
      const store = createStore()

      let rendersCount = 0

      const WrappedComponent1 = hoc([egg1])(AnyComponent1)
      const WrappedComponent2 = hoc([egg2])(AnyComponent2)

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
              <>
                <WrappedComponent1 />
                <WrappedComponent2 />
              </>
            ) : null}
            {isMounted2 ? (
              <>
                <WrappedComponent1 />
                <WrappedComponent2 />
              </>
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

    await runWith(withEggs)

    cleanup()

    await runWith(withEggsLegacy, true)
  })

  test('HOC should support React Strict Mode', async () => {
    const runWith = async (hoc: (eggs: EggTuple) => WithEggsReturnType, legacyRoot?: boolean) => {
      const store = createStore()

      let rendersCount = 0

      const WrappedComponent1 = hoc([egg1])(AnyComponent1)
      const WrappedComponent2 = hoc([egg2])(AnyComponent2)

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
              <>
                <WrappedComponent1 />
                <WrappedComponent2 />
              </>
            ) : null}
            {isMounted2 ? (
              <>
                <WrappedComponent1 />
                <WrappedComponent2 />
              </>
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

    await runWith(withEggs)

    cleanup()

    await runWith(withEggsLegacy, true)
  })

  test('HOC should clean up eggs', async () => {
    const runWith = async (hoc: (eggs: EggTuple) => WithEggsReturnType, legacyRoot?: boolean) => {
      const store = createStore()

      const WrappedComponent = hoc([egg1])(AnyComponent1)

      const Component: React.FC = () => {
        const [isMounted, setIsMounted] = React.useState(true)

        return (
          <div>
            <button onClick={() => setIsMounted(prevState => !prevState)}>{isMounted ? 'Unmount' : 'Mount'}</button>
            {isMounted ? <WrappedComponent /> : null}
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

    await runWith(withEggs)

    cleanup()

    await runWith(withEggsLegacy, true)
  })

  test('Typings tests', () => {
    interface Props {
      value: string
    }

    function expectType<T>(value: T): void {
      expect(value).toEqual(value)
    }

    {
      const Component = (props: Props) => {
        return <>{JSON.stringify(props)}</>
      }

      expectType<React.FC<Props>>(withEggs([])(Component))
    }

    {
      const Component = (props: Props) => {
        return <>{JSON.stringify(props)}</>
      }

      expectType<React.FC<Props>>(withEggsLegacy([])(Component))
    }

    {
      const Component: React.FC<Props> = props => {
        return <>{JSON.stringify(props)}</>
      }

      expectType<React.FC<Props>>(withEggs([])(Component))
    }

    {
      const Component: React.FC<Props> = props => {
        return <>{JSON.stringify(props)}</>
      }

      expectType<React.FC<Props>>(withEggsLegacy([])(Component))
    }

    {
      const WrappedComponent = withEggs([])(function Component(props: Props) {
        return <>{JSON.stringify(props)}</>
      })

      expectType<React.FC<Props>>(WrappedComponent)
    }

    {
      const WrappedComponent = withEggsLegacy([])(function Component(props: Props) {
        return <>{JSON.stringify(props)}</>
      })

      expectType<React.FC<Props>>(WrappedComponent)
    }

    {
      const WrappedComponent = withEggs([])(function Component(props) {
        return <>{JSON.stringify(props)}</>
      })

      expectType<React.FC<never>>(WrappedComponent)
    }

    {
      const WrappedComponent = withEggsLegacy([])(function Component(props) {
        return <>{JSON.stringify(props)}</>
      })

      expectType<React.FC<never>>(WrappedComponent)
    }

    {
      const WrappedComponent = withEggs([])(() => null)

      // noinspection TypeScriptRedundantGenericType
      expectType<React.FC<{}>>(WrappedComponent)
    }

    {
      const WrappedComponent = withEggsLegacy([])(() => null)

      // noinspection TypeScriptRedundantGenericType
      expectType<React.FC<{}>>(WrappedComponent)
    }

    class ClassComponentWithState extends React.Component<Props> {
      state = {
        value: 123,
      }

      render() {
        return <>{JSON.stringify(this.props)}</>
      }
    }

    {
      const WrappedComponent = withEggs([])(ClassComponentWithState)

      expectType<React.FC<Props>>(WrappedComponent)
    }

    {
      const WrappedComponent = withEggsLegacy([])(ClassComponentWithState)

      expectType<React.FC<Props>>(WrappedComponent)
    }

    class ClassComponent extends React.Component {
      render() {
        return <>{JSON.stringify(this.props)}</>
      }
    }

    {
      const WrappedComponent = withEggs([])(ClassComponent)

      // noinspection TypeScriptRedundantGenericType
      expectType<React.FC<{}>>(WrappedComponent)
    }

    {
      const WrappedComponent = withEggsLegacy([])(ClassComponent)

      // noinspection TypeScriptRedundantGenericType
      expectType<React.FC<{}>>(WrappedComponent)
    }
  })
})
