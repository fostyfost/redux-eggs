/**
 * @jest-environment jsdom
 */

import type { Egg } from '@redux-eggs/core'
import { REDUCE_ACTION_TYPE } from '@redux-eggs/core'
import type { StoreCreatorOptions } from '@redux-eggs/redux'
import { createStore } from '@redux-eggs/redux'
import type { RenderResult } from '@testing-library/react'
import { act, render } from '@testing-library/react'
import type { NextPage } from 'next'
import NextApp from 'next/app'
import type { AppType } from 'next/dist/shared/lib/utils'
import React from 'react'
import type { AnyAction, ReducersMapObject } from 'redux'
import { combineReducers } from 'redux'

import { createWrapperInitializer, HYDRATE_ACTION_TYPE } from '@/client'
import type { AppWrapperOptions } from '@/contracts'
import type { EggsConfig } from '@/contracts-internal'

describe('Next Eggs Wrapper tests (Client-side)', () => {
  const createAnyStore = (options?: StoreCreatorOptions) => createStore(options)

  const getCombiner = (actionType = HYDRATE_ACTION_TYPE) => {
    return (reducersMap: ReducersMapObject) => {
      const combinedReducer = combineReducers(reducersMap)

      return (state: any = {}, action: AnyAction) => {
        if (action.type === actionType && action.payload) {
          return combinedReducer({ ...state, ...action.payload }, action)
        }

        return combinedReducer(state, action)
      }
    }
  }

  const getSimpleCombiner = (actionType = HYDRATE_ACTION_TYPE) => {
    return () => {
      return (state: any = {}, action: AnyAction) => {
        if (action.type === actionType && action.payload) {
          return { ...state, ...action.payload }
        }

        return state
      }
    }
  }

  const egg1: Egg = { id: 'egg1', reducerMap: { reducer1: (state = {}) => state } }
  const egg2: Egg = { id: 'egg2', reducerMap: { reducer2: (state = {}) => state } }
  const egg3: Egg = { id: 'egg3', reducerMap: { reducer3: (state = {}) => state } }
  const egg4: Egg = { id: 'egg4', reducerMap: { reducer4: (state = {}) => state } }
  const egg5: Egg = { id: 'egg5', reducerMap: { reducer5: (state = {}) => state } }

  test('Store is created once', () => {
    const store = createAnyStore()
    const storeCreator = jest.fn(() => store)

    const wrapperInitializer = createWrapperInitializer(storeCreator)

    const appWrapper = wrapperInitializer.getAppWrapper()
    const WrappedApp1: AppType = appWrapper.wrapApp(() => null)
    const WrappedApp2: AppType = appWrapper.wrapApp(() => null)

    let renderResult1: RenderResult
    let renderResult2: RenderResult

    act(() => {
      renderResult1 = render(<WrappedApp1 Component={() => null} router={{} as any} pageProps={{}} />)
      renderResult2 = render(<WrappedApp2 Component={() => null} router={{} as any} pageProps={{}} />)
    })

    act(() => {
      renderResult1.rerender(<WrappedApp1 Component={() => null} router={{} as any} pageProps={{ test: 1 }} />)
      renderResult2.rerender(<WrappedApp2 Component={() => null} router={{} as any} pageProps={{ test: 2 }} />)
    })

    expect(storeCreator).toBeCalledTimes(1)
  })

  test('Store is created once in React Strict Mode', () => {
    const renderChecker = jest.fn()

    let store = createAnyStore()
    let spyOnAddEggs = jest.spyOn(store, 'addEggs')
    let spyOnDispatch = jest.spyOn(store, 'dispatch')

    const storeCreator = jest.fn(() => {
      store = createAnyStore()
      spyOnAddEggs = jest.spyOn(store, 'addEggs')
      spyOnDispatch = jest.spyOn(store, 'dispatch')
      return store
    })

    const WrappedApp1 = createWrapperInitializer(storeCreator)
      .getAppWrapper([egg1])
      .wrapApp(() => {
        renderChecker()
        return null
      }) as any

    const Page1: NextPage = () => null

    act(() => {
      render(<WrappedApp1 Component={Page1} pageProps={{ __eggsState: { test: 123 } }} />)
    })

    expect(renderChecker).toBeCalledTimes(1)
    expect(storeCreator).toBeCalledTimes(1)
    expect(spyOnAddEggs).toBeCalledTimes(1)
    expect(spyOnAddEggs).toBeCalledWith([egg1])
    expect(spyOnDispatch).toBeCalledTimes(2)
    expect(spyOnDispatch).nthCalledWith(1, { type: REDUCE_ACTION_TYPE })
    expect(spyOnDispatch).nthCalledWith(2, { type: HYDRATE_ACTION_TYPE, payload: { test: 123 } })

    renderChecker.mockClear()
    storeCreator.mockClear()
    spyOnAddEggs.mockClear()
    spyOnDispatch.mockClear()

    const WrappedApp2 = createWrapperInitializer(storeCreator)
      .getAppWrapper([egg1])
      .wrapApp(() => {
        renderChecker()
        return null
      }) as any

    const Page2: NextPage = () => null

    act(() => {
      render(
        <React.StrictMode>
          <WrappedApp2 Component={Page2} pageProps={{ __eggsState: { test: 123 } }} />
        </React.StrictMode>,
      )
    })

    expect(renderChecker).toBeCalledTimes(2)
    expect(storeCreator).toBeCalledTimes(1)
    expect(spyOnAddEggs).toBeCalledTimes(1)
    expect(spyOnAddEggs).toBeCalledWith([egg1])
    expect(spyOnDispatch).toBeCalledTimes(2)
    expect(spyOnDispatch).nthCalledWith(1, { type: REDUCE_ACTION_TYPE })
    expect(spyOnDispatch).nthCalledWith(2, { type: HYDRATE_ACTION_TYPE, payload: { test: 123 } })
  })

  test('Wrapped Page contains `eggs`', () => {
    const wrapperInitializer = createWrapperInitializer(createAnyStore)

    const pageWrapper1 = wrapperInitializer.getPageWrapper()
    const WrappedPage1 = pageWrapper1.wrapPage(() => null)
    expect((WrappedPage1 as EggsConfig).__eggs).toEqual([])

    const pageWrapper2 = wrapperInitializer.getPageWrapper([])
    const WrappedPage2 = pageWrapper2.wrapPage(() => null)
    expect((WrappedPage2 as EggsConfig).__eggs).toEqual([])

    const pageWrapper3 = wrapperInitializer.getPageWrapper([egg1, egg2, egg3])
    const WrappedPage3 = pageWrapper3.wrapPage(() => null)
    expect((WrappedPage3 as EggsConfig).__eggs).toEqual([egg1, egg2, egg3])

    const pageWrapper4 = wrapperInitializer.getPageWrapper([[egg4], [[[egg5]]]])
    const WrappedPage4 = pageWrapper4.wrapPage(() => null)
    expect((WrappedPage4 as EggsConfig).__eggs).toEqual([[egg4], [[[egg5]]]])
  })

  describe('Tests for initial eggs concatenation, store creation and initial hydration', () => {
    describe('Wrapped App with GIP and Page with GIP', () => {
      test('Unwrapped page', async () => {
        const store = createAnyStore({ combiner: getSimpleCombiner() })
        const storeCreator = () => store

        const spyOnAddEggs = jest.spyOn(store, 'addEggs')
        const spyOnDispatch = jest.spyOn(store, 'dispatch')

        const wrapperInitializer = createWrapperInitializer(storeCreator)

        const App: AppType = () => null
        const appWrapper = wrapperInitializer.getAppWrapper()
        App.getInitialProps = appWrapper.wrapGetInitialProps(() => context => NextApp.getInitialProps(context))
        const WrappedApp = appWrapper.wrapApp(App)

        const Page = () => null
        const pageWrapper = wrapperInitializer.getPageWrapper()
        Page.getInitialProps = pageWrapper.wrapGetInitialProps()

        act(() => {
          render(
            <WrappedApp Component={Page} router={{} as any} pageProps={{ __eggsState: { value: 'initial state' } }} />,
          )
        })

        expect((Page as EggsConfig).__eggs).toBeUndefined()
        expect(spyOnAddEggs).toBeCalledTimes(1)
        expect(spyOnAddEggs).toBeCalledWith([])
        expect(spyOnDispatch).toBeCalledTimes(1)
        expect(spyOnDispatch).toBeCalledWith({ type: HYDRATE_ACTION_TYPE, payload: { value: 'initial state' } })
        expect(Object.keys(store.getState())).toEqual([])
      })

      test('Eggs: `undefined`', async () => {
        const store = createAnyStore({ combiner: getSimpleCombiner() })
        const storeCreator = () => store

        const spyOnAddEggs = jest.spyOn(store, 'addEggs')
        const spyOnDispatch = jest.spyOn(store, 'dispatch')

        const wrapperInitializer = createWrapperInitializer(storeCreator)

        const App: AppType = () => null
        const appWrapper = wrapperInitializer.getAppWrapper()
        App.getInitialProps = appWrapper.wrapGetInitialProps(() => context => NextApp.getInitialProps(context))
        const WrappedApp = appWrapper.wrapApp(App)

        const Page = () => null
        const pageWrapper = wrapperInitializer.getPageWrapper()
        Page.getInitialProps = pageWrapper.wrapGetInitialProps()
        const WrappedPage = pageWrapper.wrapPage(Page)

        act(() => {
          render(
            <WrappedApp
              Component={WrappedPage}
              router={{} as any}
              pageProps={{ __eggsState: { value: 'initial state' } }}
            />,
          )
        })

        expect((Page as EggsConfig).__eggs).toEqual([])
        expect(spyOnAddEggs).toBeCalledTimes(1)
        expect(spyOnAddEggs).toBeCalledWith([])
        expect(spyOnDispatch).toBeCalledTimes(1)
        expect(spyOnDispatch).toBeCalledWith({ type: HYDRATE_ACTION_TYPE, payload: { value: 'initial state' } })
        expect(Object.keys(store.getState())).toEqual([])
      })

      test('Eggs: `[]`', async () => {
        const store = createAnyStore({ combiner: getSimpleCombiner() })
        const storeCreator = () => store

        const spyOnAddEggs = jest.spyOn(store, 'addEggs')
        const spyOnDispatch = jest.spyOn(store, 'dispatch')

        const wrapperInitializer = createWrapperInitializer(storeCreator)

        const App: AppType = () => null
        const appWrapper = wrapperInitializer.getAppWrapper([])
        App.getInitialProps = appWrapper.wrapGetInitialProps(() => context => NextApp.getInitialProps(context))
        const WrappedApp = appWrapper.wrapApp(App)

        const Page = () => null
        const pageWrapper = wrapperInitializer.getPageWrapper([])
        Page.getInitialProps = pageWrapper.wrapGetInitialProps()
        const WrappedPage = pageWrapper.wrapPage(Page)

        act(() => {
          render(
            <WrappedApp
              Component={WrappedPage}
              router={{} as any}
              pageProps={{ __eggsState: { value: 'initial state' } }}
            />,
          )
        })

        expect((Page as EggsConfig).__eggs).toEqual([])
        expect(spyOnAddEggs).toBeCalledTimes(1)
        expect(spyOnAddEggs).toBeCalledWith([])
        expect(spyOnDispatch).toBeCalledTimes(1)
        expect(spyOnDispatch).toBeCalledWith({ type: HYDRATE_ACTION_TYPE, payload: { value: 'initial state' } })
        expect(Object.keys(store.getState())).toEqual([])
      })

      test('Eggs: `Egg[]`', async () => {
        const store = createAnyStore({ combiner: getCombiner() })
        const storeCreator = () => store

        const spyOnAddEggs = jest.spyOn(store, 'addEggs')
        const spyOnDispatch = jest.spyOn(store, 'dispatch')

        const wrapperInitializer = createWrapperInitializer(storeCreator)

        const App: AppType = () => null
        const appWrapper = wrapperInitializer.getAppWrapper([egg1])
        App.getInitialProps = appWrapper.wrapGetInitialProps(() => context => NextApp.getInitialProps(context))
        const WrappedApp = appWrapper.wrapApp(App)

        const Page = () => null
        const pageWrapper = wrapperInitializer.getPageWrapper([egg2, egg3])
        Page.getInitialProps = pageWrapper.wrapGetInitialProps()
        const WrappedPage = pageWrapper.wrapPage(Page)

        const getPageProps = () => ({
          __eggsState: {
            reducer1: { value: 1 },
            reducer2: { value: 2 },
            reducer3: { value: 3 },
          },
        })

        act(() => {
          render(<WrappedApp Component={WrappedPage} router={{} as any} pageProps={getPageProps()} />)
        })

        expect((Page as EggsConfig).__eggs).toEqual([egg2, egg3])
        expect(spyOnAddEggs).toBeCalledTimes(1)
        expect(spyOnAddEggs).toBeCalledWith([egg1, egg2, egg3])
        expect(spyOnDispatch).toBeCalledTimes(2)
        expect(spyOnDispatch).nthCalledWith(1, { type: REDUCE_ACTION_TYPE })
        expect(spyOnDispatch).nthCalledWith(2, { type: HYDRATE_ACTION_TYPE, payload: getPageProps().__eggsState })
        expect(store.getState()).toEqual(getPageProps().__eggsState)
      })

      test('Eggs: `EggTuple`', async () => {
        const store = createAnyStore({ combiner: getCombiner() })
        const storeCreator = () => store

        const spyOnAddEggs = jest.spyOn(store, 'addEggs')
        const spyOnDispatch = jest.spyOn(store, 'dispatch')

        const wrapperInitializer = createWrapperInitializer(storeCreator)

        const App: AppType = () => null
        const appWrapper = wrapperInitializer.getAppWrapper([egg1, [egg2, egg3]])
        App.getInitialProps = appWrapper.wrapGetInitialProps(() => context => NextApp.getInitialProps(context))
        const WrappedApp = appWrapper.wrapApp(App)

        const Page = () => null
        const pageWrapper = wrapperInitializer.getPageWrapper([[[egg4], [[[egg5]]]]])
        Page.getInitialProps = pageWrapper.wrapGetInitialProps()
        const WrappedPage = pageWrapper.wrapPage(Page)

        const getPageProps = () => ({
          __eggsState: {
            reducer1: { value: 1 },
            reducer2: { value: 2 },
            reducer3: { value: 3 },
            reducer4: { value: 4 },
            reducer5: { value: 5 },
          },
        })

        act(() => {
          render(<WrappedApp Component={WrappedPage} router={{} as any} pageProps={getPageProps()} />)
        })

        expect((Page as EggsConfig).__eggs).toEqual([[[egg4], [[[egg5]]]]])
        expect(spyOnAddEggs).toBeCalledTimes(1)
        expect(spyOnAddEggs).toBeCalledWith([egg1, [egg2, egg3], [[egg4], [[[egg5]]]]])
        expect(spyOnDispatch).toBeCalledTimes(2)
        expect(spyOnDispatch).nthCalledWith(1, { type: REDUCE_ACTION_TYPE })
        expect(spyOnDispatch).nthCalledWith(2, { type: HYDRATE_ACTION_TYPE, payload: getPageProps().__eggsState })
        expect(store.getState()).toEqual(getPageProps().__eggsState)
      })

      test('Eggs: App eggs = `Egg[]`, Page eggs = `[]`', async () => {
        const store = createAnyStore({ combiner: getCombiner() })
        const storeCreator = () => store

        const spyOnAddEggs = jest.spyOn(store, 'addEggs')
        const spyOnDispatch = jest.spyOn(store, 'dispatch')

        const wrapperInitializer = createWrapperInitializer(storeCreator)

        const App: AppType = () => null
        const appWrapper = wrapperInitializer.getAppWrapper([egg1])
        App.getInitialProps = appWrapper.wrapGetInitialProps(() => context => NextApp.getInitialProps(context))
        const WrappedApp = appWrapper.wrapApp(App)

        const Page = () => null
        const pageWrapper = wrapperInitializer.getPageWrapper()
        Page.getInitialProps = pageWrapper.wrapGetInitialProps()
        const WrappedPage = pageWrapper.wrapPage(Page)

        const getPageProps = () => ({
          __eggsState: {
            reducer1: { value: 1 },
          },
        })

        act(() => {
          render(<WrappedApp Component={WrappedPage} router={{} as any} pageProps={getPageProps()} />)
        })

        expect((Page as EggsConfig).__eggs).toEqual([])
        expect(spyOnAddEggs).toBeCalledTimes(1)
        expect(spyOnAddEggs).toBeCalledWith([egg1])
        expect(spyOnDispatch).toBeCalledTimes(2)
        expect(spyOnDispatch).nthCalledWith(1, { type: REDUCE_ACTION_TYPE })
        expect(spyOnDispatch).nthCalledWith(2, { type: HYDRATE_ACTION_TYPE, payload: getPageProps().__eggsState })
        expect(store.getState()).toEqual(getPageProps().__eggsState)
      })

      test('Eggs: App eggs = `[]`, Page eggs = `Egg[]`', async () => {
        const store = createAnyStore({ combiner: getCombiner() })
        const storeCreator = () => store

        const spyOnAddEggs = jest.spyOn(store, 'addEggs')
        const spyOnDispatch = jest.spyOn(store, 'dispatch')

        const wrapperInitializer = createWrapperInitializer(storeCreator)

        const App: AppType = () => null
        const appWrapper = wrapperInitializer.getAppWrapper()
        App.getInitialProps = appWrapper.wrapGetInitialProps(() => context => NextApp.getInitialProps(context))
        const WrappedApp = appWrapper.wrapApp(App)

        const Page = () => null
        const pageWrapper = wrapperInitializer.getPageWrapper([egg5])
        Page.getInitialProps = pageWrapper.wrapGetInitialProps()
        const WrappedPage = pageWrapper.wrapPage(Page)

        const getPageProps = () => ({
          __eggsState: {
            reducer5: { value: 5 },
          },
        })

        act(() => {
          render(<WrappedApp Component={WrappedPage} router={{} as any} pageProps={getPageProps()} />)
        })

        expect((Page as EggsConfig).__eggs).toEqual([egg5])
        expect(spyOnAddEggs).toBeCalledTimes(1)
        expect(spyOnAddEggs).toBeCalledWith([egg5])
        expect(spyOnDispatch).toBeCalledTimes(2)
        expect(spyOnDispatch).nthCalledWith(1, { type: REDUCE_ACTION_TYPE })
        expect(spyOnDispatch).nthCalledWith(2, { type: HYDRATE_ACTION_TYPE, payload: getPageProps().__eggsState })
        expect(store.getState()).toEqual(getPageProps().__eggsState)
      })
    })

    describe('Wrapped App without GIP and Page with GIP', () => {
      test('Unwrapped page', async () => {
        const store = createAnyStore({ combiner: getSimpleCombiner() })
        const storeCreator = () => store

        const spyOnAddEggs = jest.spyOn(store, 'addEggs')
        const spyOnDispatch = jest.spyOn(store, 'dispatch')

        const wrapperInitializer = createWrapperInitializer(storeCreator)
        const WrappedApp: AppType = wrapperInitializer.getAppWrapper().wrapApp(() => null)

        const Page = () => null
        const pageWrapper = wrapperInitializer.getPageWrapper()
        Page.getInitialProps = pageWrapper.wrapGetInitialProps()

        act(() => {
          render(
            <WrappedApp Component={Page} router={{} as any} pageProps={{ __eggsState: { value: 'initial state' } }} />,
          )
        })

        expect((Page as EggsConfig).__eggs).toBeUndefined()
        expect(spyOnAddEggs).toBeCalledTimes(1)
        expect(spyOnAddEggs).toBeCalledWith([])
        expect(spyOnDispatch).toBeCalledTimes(1)
        expect(spyOnDispatch).toBeCalledWith({ type: HYDRATE_ACTION_TYPE, payload: { value: 'initial state' } })
        expect(Object.keys(store.getState())).toEqual([])
      })

      test('Eggs: `undefined`', async () => {
        const store = createAnyStore({ combiner: getSimpleCombiner() })
        const storeCreator = () => store

        const spyOnAddEggs = jest.spyOn(store, 'addEggs')
        const spyOnDispatch = jest.spyOn(store, 'dispatch')

        const wrapperInitializer = createWrapperInitializer(storeCreator)
        const WrappedApp: AppType = wrapperInitializer.getAppWrapper().wrapApp(() => null)

        const Page = () => null
        const pageWrapper = wrapperInitializer.getPageWrapper()
        Page.getInitialProps = pageWrapper.wrapGetInitialProps()
        const WrappedPage = pageWrapper.wrapPage(Page)

        act(() => {
          render(
            <WrappedApp
              Component={WrappedPage}
              router={{} as any}
              pageProps={{ __eggsState: { value: 'initial state' } }}
            />,
          )
        })

        expect((Page as EggsConfig).__eggs).toEqual([])
        expect(spyOnAddEggs).toBeCalledTimes(1)
        expect(spyOnAddEggs).toBeCalledWith([])
        expect(spyOnDispatch).toBeCalledTimes(1)
        expect(spyOnDispatch).toBeCalledWith({ type: HYDRATE_ACTION_TYPE, payload: { value: 'initial state' } })
        expect(Object.keys(store.getState())).toEqual([])
      })

      test('Eggs: `[]`', async () => {
        const store = createAnyStore({ combiner: getSimpleCombiner() })
        const storeCreator = () => store

        const spyOnAddEggs = jest.spyOn(store, 'addEggs')
        const spyOnDispatch = jest.spyOn(store, 'dispatch')

        const wrapperInitializer = createWrapperInitializer(storeCreator)
        const WrappedApp: AppType = wrapperInitializer.getAppWrapper([]).wrapApp(() => null)

        const Page = () => null
        const pageWrapper = wrapperInitializer.getPageWrapper([])
        Page.getInitialProps = pageWrapper.wrapGetInitialProps()
        const WrappedPage = pageWrapper.wrapPage(Page)

        act(() => {
          render(
            <WrappedApp
              Component={WrappedPage}
              router={{} as any}
              pageProps={{ __eggsState: { value: 'initial state' } }}
            />,
          )
        })

        expect((Page as EggsConfig).__eggs).toEqual([])
        expect(spyOnAddEggs).toBeCalledTimes(1)
        expect(spyOnAddEggs).toBeCalledWith([])
        expect(spyOnDispatch).toBeCalledTimes(1)
        expect(spyOnDispatch).toBeCalledWith({ type: HYDRATE_ACTION_TYPE, payload: { value: 'initial state' } })
        expect(Object.keys(store.getState())).toEqual([])
      })

      test('Eggs: `Egg[]`', async () => {
        const store = createAnyStore({ combiner: getCombiner() })
        const storeCreator = () => store

        const spyOnAddEggs = jest.spyOn(store, 'addEggs')
        const spyOnDispatch = jest.spyOn(store, 'dispatch')

        const wrapperInitializer = createWrapperInitializer(storeCreator)
        const WrappedApp: AppType = wrapperInitializer.getAppWrapper([egg1]).wrapApp(() => null)

        const Page = () => null
        const pageWrapper = wrapperInitializer.getPageWrapper([egg2, egg3])
        Page.getInitialProps = pageWrapper.wrapGetInitialProps()
        const WrappedPage = pageWrapper.wrapPage(Page)

        const getPageProps = () => ({
          __eggsState: {
            reducer1: { value: 1 },
            reducer2: { value: 2 },
            reducer3: { value: 3 },
          },
        })

        act(() => {
          render(<WrappedApp Component={WrappedPage} router={{} as any} pageProps={getPageProps()} />)
        })

        expect((Page as EggsConfig).__eggs).toEqual([egg2, egg3])
        expect(spyOnAddEggs).toBeCalledTimes(1)
        expect(spyOnAddEggs).toBeCalledWith([egg1, egg2, egg3])
        expect(spyOnDispatch).toBeCalledTimes(2)
        expect(spyOnDispatch).nthCalledWith(1, { type: REDUCE_ACTION_TYPE })
        expect(spyOnDispatch).nthCalledWith(2, { type: HYDRATE_ACTION_TYPE, payload: getPageProps().__eggsState })
        expect(store.getState()).toEqual(getPageProps().__eggsState)
      })

      test('Eggs: `EggTuple`', async () => {
        const store = createAnyStore({ combiner: getCombiner() })
        const storeCreator = () => store

        const spyOnAddEggs = jest.spyOn(store, 'addEggs')
        const spyOnDispatch = jest.spyOn(store, 'dispatch')

        const wrapperInitializer = createWrapperInitializer(storeCreator)
        const WrappedApp: AppType = wrapperInitializer.getAppWrapper([egg1, [egg2, egg3]]).wrapApp(() => null)

        const Page = () => null
        const pageWrapper = wrapperInitializer.getPageWrapper([[[egg4], [[[egg5]]]]])
        Page.getInitialProps = pageWrapper.wrapGetInitialProps()
        const WrappedPage = pageWrapper.wrapPage(Page)

        const getPageProps = () => ({
          __eggsState: {
            reducer1: { value: 1 },
            reducer2: { value: 2 },
            reducer3: { value: 3 },
            reducer4: { value: 4 },
            reducer5: { value: 5 },
          },
        })

        act(() => {
          render(<WrappedApp Component={WrappedPage} router={{} as any} pageProps={getPageProps()} />)
        })

        expect((Page as EggsConfig).__eggs).toEqual([[[egg4], [[[egg5]]]]])
        expect(spyOnAddEggs).toBeCalledTimes(1)
        expect(spyOnAddEggs).toBeCalledWith([egg1, [egg2, egg3], [[egg4], [[[egg5]]]]])
        expect(spyOnDispatch).toBeCalledTimes(2)
        expect(spyOnDispatch).nthCalledWith(1, { type: REDUCE_ACTION_TYPE })
        expect(spyOnDispatch).nthCalledWith(2, { type: HYDRATE_ACTION_TYPE, payload: getPageProps().__eggsState })
        expect(store.getState()).toEqual(getPageProps().__eggsState)
      })

      test('Eggs: App eggs = `Egg[]`, Page eggs = `[]`', async () => {
        const store = createAnyStore({ combiner: getCombiner() })
        const storeCreator = () => store

        const spyOnAddEggs = jest.spyOn(store, 'addEggs')
        const spyOnDispatch = jest.spyOn(store, 'dispatch')

        const wrapperInitializer = createWrapperInitializer(storeCreator)
        const WrappedApp: AppType = wrapperInitializer.getAppWrapper([egg1]).wrapApp(() => null)

        const Page = () => null
        const pageWrapper = wrapperInitializer.getPageWrapper()
        Page.getInitialProps = pageWrapper.wrapGetInitialProps()
        const WrappedPage = pageWrapper.wrapPage(Page)

        const getPageProps = () => ({
          __eggsState: {
            reducer1: { value: 1 },
          },
        })

        act(() => {
          render(<WrappedApp Component={WrappedPage} router={{} as any} pageProps={getPageProps()} />)
        })

        expect((Page as EggsConfig).__eggs).toEqual([])
        expect(spyOnAddEggs).toBeCalledTimes(1)
        expect(spyOnAddEggs).toBeCalledWith([egg1])
        expect(spyOnDispatch).toBeCalledTimes(2)
        expect(spyOnDispatch).nthCalledWith(1, { type: REDUCE_ACTION_TYPE })
        expect(spyOnDispatch).nthCalledWith(2, { type: HYDRATE_ACTION_TYPE, payload: getPageProps().__eggsState })
        expect(store.getState()).toEqual(getPageProps().__eggsState)
      })

      test('Eggs: App eggs = `[]`, Page eggs = `Egg[]`', async () => {
        const store = createAnyStore({ combiner: getCombiner() })
        const storeCreator = () => store

        const spyOnAddEggs = jest.spyOn(store, 'addEggs')
        const spyOnDispatch = jest.spyOn(store, 'dispatch')

        const wrapperInitializer = createWrapperInitializer(storeCreator)
        const WrappedApp: AppType = wrapperInitializer.getAppWrapper().wrapApp(() => null)

        const Page = () => null
        const pageWrapper = wrapperInitializer.getPageWrapper([egg5])
        Page.getInitialProps = pageWrapper.wrapGetInitialProps()
        const WrappedPage = pageWrapper.wrapPage(Page)

        const getPageProps = () => ({
          __eggsState: {
            reducer5: { value: 5 },
          },
        })

        act(() => {
          render(<WrappedApp Component={WrappedPage} router={{} as any} pageProps={getPageProps()} />)
        })

        expect((Page as EggsConfig).__eggs).toEqual([egg5])
        expect(spyOnAddEggs).toBeCalledTimes(1)
        expect(spyOnAddEggs).toBeCalledWith([egg5])
        expect(spyOnDispatch).toBeCalledTimes(2)
        expect(spyOnDispatch).nthCalledWith(1, { type: REDUCE_ACTION_TYPE })
        expect(spyOnDispatch).nthCalledWith(2, { type: HYDRATE_ACTION_TYPE, payload: getPageProps().__eggsState })
        expect(store.getState()).toEqual(getPageProps().__eggsState)
      })
    })
  })

  describe('App wrapper with `beforeResult`', () => {
    test('`beforeResult` should be called once in App GIP if App and Page has GIP', async () => {
      const store = createAnyStore()
      const storeCreator = jest.fn(() => store)
      const beforeResult = jest.fn()
      const wrapperInitializer = createWrapperInitializer(storeCreator)

      const App: AppType = () => null
      const appWrapper = wrapperInitializer.getAppWrapper([], { beforeResult })
      App.getInitialProps = appWrapper.wrapGetInitialProps(() => context => NextApp.getInitialProps(context))
      const WrappedApp: AppType = appWrapper.wrapApp(App)

      const Page: NextPage = () => null
      const pageWrapper = wrapperInitializer.getPageWrapper()
      Page.getInitialProps = pageWrapper.wrapGetInitialProps(() => () => ({ test: 123 }))
      const WrappedPage = pageWrapper.wrapPage(Page)
      const spyOnWrappedPageGip = jest.spyOn(WrappedPage, 'getInitialProps')

      expect(spyOnWrappedPageGip).not.toBeCalled()
      expect(storeCreator).not.toBeCalled()
      expect(beforeResult).not.toBeCalled()
      expect(beforeResult).not.toBeCalled()

      act(() => {
        render(
          <WrappedApp
            Component={() => null}
            router={{} as any}
            pageProps={{ __eggsState: { value: 'initial state' } }}
          />,
        )
      })

      expect(spyOnWrappedPageGip).not.toBeCalled()
      expect(storeCreator).toBeCalledTimes(1)
      expect(beforeResult).not.toBeCalled()
      expect(beforeResult).not.toBeCalled()

      await WrappedApp.getInitialProps?.({ Component: Page, ctx: {} } as any)

      expect(spyOnWrappedPageGip).toBeCalledTimes(1)
      expect(storeCreator).toBeCalledTimes(1)
      expect(beforeResult).toBeCalledTimes(1)
      expect(beforeResult).toBeCalledWith(store, { context: { Component: Page, ctx: {} } })
    })

    test('`beforeResult` should be called once in Page GIP if App does not have GIP', async () => {
      const store = createAnyStore()
      const storeCreator = jest.fn(() => store)
      const beforeResult = jest.fn()
      const wrapperInitializer = createWrapperInitializer(storeCreator)

      const App: AppType = () => null
      const appWrapper = wrapperInitializer.getAppWrapper([], { beforeResult })
      const WrappedApp: AppType = appWrapper.wrapApp(App)

      const Page: NextPage = () => null
      const pageWrapper = wrapperInitializer.getPageWrapper()
      Page.getInitialProps = pageWrapper.wrapGetInitialProps(() => () => ({ test: 123 }))
      const WrappedPage = pageWrapper.wrapPage(Page)

      expect(storeCreator).not.toBeCalled()
      expect(beforeResult).not.toBeCalled()

      act(() => {
        render(
          <WrappedApp
            Component={() => null}
            router={{} as any}
            pageProps={{ __eggsState: { value: 'initial state' } }}
          />,
        )
      })

      expect(storeCreator).toBeCalledTimes(1)
      expect(beforeResult).not.toBeCalled()

      const anyPageContext = { isPage: true }
      await WrappedPage.getInitialProps?.(anyPageContext as any)
      expect(storeCreator).toBeCalledTimes(1)
      expect(beforeResult).toBeCalledTimes(1)
      expect(beforeResult).toBeCalledWith(store, { context: anyPageContext })
    })

    test('Undefined `beforeResult` should be checked', async () => {
      const store = createAnyStore({ combiner: getCombiner() })
      const storeCreator = () => store

      const wrapperInitializer = createWrapperInitializer(storeCreator)

      const options = {
        get beforeResult() {
          return undefined
        },
      }

      const spyOnBeforeResult = jest.spyOn(options, 'beforeResult', 'get')

      const Page: NextPage = () => null

      const App: AppType = () => null
      const appWrapper = wrapperInitializer.getAppWrapper([], options as AppWrapperOptions)
      App.getInitialProps = appWrapper.wrapGetInitialProps(() => context => NextApp.getInitialProps(context))
      const WrappedApp: AppType = appWrapper.wrapApp(App)

      act(() => {
        render(<WrappedApp Component={Page} router={{} as any} pageProps={{}} />)
      })

      await WrappedApp.getInitialProps?.({ Component: Page, ctx: {} } as any)

      expect(spyOnBeforeResult).toBeCalledTimes(1)
    })
  })

  test('When changing the page, the eggs of the previous page should be removed', () => {
    const store = createAnyStore({ combiner: getCombiner() })
    const storeCreator = () => store

    const spyOnAddEggs = jest.spyOn(store, 'addEggs')
    const spyOnRemoveEggs = jest.spyOn(store, 'removeEggs')
    const spyOnDispatch = jest.spyOn(store, 'dispatch')

    const wrapperInitializer = createWrapperInitializer(storeCreator)

    const App: AppType = () => null
    const appWrapper = wrapperInitializer.getAppWrapper([egg1])
    const WrappedApp: AppType = appWrapper.wrapApp(App)

    const WrappedPage1: NextPage = wrapperInitializer.getPageWrapper([egg2]).wrapPage(() => null)
    const WrappedPage2: NextPage = wrapperInitializer.getPageWrapper([egg3]).wrapPage(() => null)
    const UnwrappedPage: NextPage = () => null

    expect(spyOnAddEggs).not.toBeCalled()
    expect(spyOnRemoveEggs).not.toBeCalled()
    expect(spyOnDispatch).not.toBeCalled()

    let renderResult: RenderResult

    act(() => {
      renderResult = render(
        <WrappedApp
          Component={WrappedPage1}
          router={{} as any}
          pageProps={{ __eggsState: { reducer1: { value: 1 }, reducer2: { value: 1 } } }}
        />,
      )
    })

    expect(spyOnAddEggs).toBeCalledTimes(1)
    expect(spyOnAddEggs).toBeCalledWith([egg1, egg2])
    expect(spyOnRemoveEggs).not.toBeCalled()
    expect(spyOnDispatch).toBeCalledTimes(2)
    expect(spyOnDispatch).nthCalledWith(1, { type: REDUCE_ACTION_TYPE })
    expect(spyOnDispatch).nthCalledWith(2, {
      type: HYDRATE_ACTION_TYPE,
      payload: { reducer1: { value: 1 }, reducer2: { value: 1 } },
    })
    expect(store.getState()).toEqual({ reducer1: { value: 1 }, reducer2: { value: 1 } })

    spyOnAddEggs.mockClear()
    spyOnDispatch.mockClear()

    const nextState = { reducer1: { value: 2 }, reducer3: { value: 2 } }

    act(() => {
      renderResult.rerender(
        <WrappedApp Component={WrappedPage2} router={{} as any} pageProps={{ __eggsState: nextState }} />,
      )
    })

    expect(spyOnAddEggs).toBeCalledTimes(1)
    expect(spyOnAddEggs).toBeCalledWith([egg3])
    expect(spyOnRemoveEggs).toBeCalledTimes(1)
    expect(spyOnRemoveEggs).toBeCalledWith([egg2])
    expect(spyOnDispatch).toBeCalledTimes(3)
    expect(spyOnDispatch).nthCalledWith(1, { type: REDUCE_ACTION_TYPE })
    expect(spyOnDispatch).nthCalledWith(2, { type: HYDRATE_ACTION_TYPE, payload: nextState })
    expect(spyOnDispatch).nthCalledWith(3, { type: REDUCE_ACTION_TYPE })
    expect(store.getState()).toEqual({ reducer1: { value: 2 }, reducer3: { value: 2 } })

    spyOnAddEggs.mockClear()
    spyOnRemoveEggs.mockClear()
    spyOnDispatch.mockClear()

    act(() => {
      renderResult.rerender(
        <WrappedApp Component={WrappedPage2} router={{ asPath: '#' } as any} pageProps={{ __eggsState: nextState }} />,
      )
    })

    expect(spyOnAddEggs).not.toBeCalled()
    expect(spyOnRemoveEggs).not.toBeCalled()
    expect(spyOnDispatch).not.toBeCalled()
    expect(store.getState()).toEqual({ reducer1: { value: 2 }, reducer3: { value: 2 } })

    act(() => {
      renderResult.rerender(<WrappedApp Component={UnwrappedPage} router={{} as any} pageProps={{}} />)
    })

    expect(spyOnAddEggs).toBeCalledTimes(1)
    expect(spyOnAddEggs).toBeCalledWith([])
    expect(spyOnRemoveEggs).toBeCalledTimes(1)
    expect(spyOnRemoveEggs).toBeCalledWith([egg3])
    expect(spyOnDispatch).toBeCalledTimes(1)
    expect(spyOnDispatch).toBeCalledWith({ type: REDUCE_ACTION_TYPE })
    expect(store.getState()).toEqual({ reducer1: { value: 2 } })
  })

  test('GIP of wrapped App should not return initial props with store', async () => {
    const store = createAnyStore({ combiner: getCombiner() })
    const storeCreator = () => store

    const beforeResult = jest.fn()

    const wrapperInitializer = createWrapperInitializer(storeCreator)

    const App: AppType = () => null
    const appWrapper = wrapperInitializer.getAppWrapper([], { beforeResult })
    App.getInitialProps = appWrapper.wrapGetInitialProps(() => context => NextApp.getInitialProps(context))
    const WrappedApp: AppType = appWrapper.wrapApp(App)

    act(() => {
      render(<WrappedApp Component={() => null} router={{} as any} pageProps={{}} />)
    })

    expect(beforeResult).not.toBeCalled()

    const appContext = { Component: () => null, ctx: {} }
    const result = await WrappedApp.getInitialProps?.(appContext as any)

    expect(beforeResult).toBeCalledTimes(1)
    expect(beforeResult).toBeCalledWith(store, { context: appContext })
    expect(result).toEqual({ pageProps: {} })
  })

  test('GIP of wrapped Page should not return initial props with store', async () => {
    const store = createAnyStore({ combiner: getCombiner() })
    const storeCreator = () => store

    const beforeResult = jest.fn()

    const wrapperInitializer = createWrapperInitializer(storeCreator)

    const WrappedApp: AppType = wrapperInitializer.getAppWrapper([], { beforeResult }).wrapApp(() => null)

    const Page: NextPage = () => null
    const pageWrapper = wrapperInitializer.getPageWrapper()
    Page.getInitialProps = pageWrapper.wrapGetInitialProps(() => () => ({ test: 123 }))
    const WrappedPage = pageWrapper.wrapPage(Page)

    act(() => {
      render(<WrappedApp Component={WrappedPage} router={{} as any} pageProps={{}} />)
    })

    expect(beforeResult).not.toBeCalled()

    const result = await WrappedPage.getInitialProps?.({ isPage: true } as any)

    expect(beforeResult).toBeCalledTimes(1)
    expect(beforeResult).toBeCalledWith(store, { context: { isPage: true } })
    expect(result).toEqual({ test: 123 })
  })

  test('Non-initial hydration fires only for page without GIP', async () => {
    const store = createAnyStore({ combiner: getCombiner() })
    const storeCreator = () => store

    const spyOnDispatch = jest.spyOn(store, 'dispatch')

    const wrapperInitializer = createWrapperInitializer(storeCreator)

    const App: AppType = () => null
    const appWrapper = wrapperInitializer.getAppWrapper([egg1])
    App.getInitialProps = appWrapper.wrapGetInitialProps(() => context => NextApp.getInitialProps(context))
    const WrappedApp: AppType = appWrapper.wrapApp(App)

    const pageWrapper1 = wrapperInitializer.getPageWrapper([egg2])
    const WrappedPage1: NextPage = pageWrapper1.wrapPage(() => null)

    const pageWrapper2 = wrapperInitializer.getPageWrapper([egg3])
    const Page2: NextPage = () => null
    Page2.getInitialProps = pageWrapper2.wrapGetInitialProps(() => () => ({ test: 123 }))
    const WrappedPage2: NextPage = pageWrapper2.wrapPage(Page2)

    expect(spyOnDispatch).not.toBeCalled()

    let renderResult: RenderResult

    act(() => {
      renderResult = render(
        <WrappedApp
          Component={WrappedPage1}
          router={{} as any}
          pageProps={{ __eggsState: { reducer1: { value: 1 }, reducer2: { value: 1 } } }}
        />,
      )
    })

    expect(spyOnDispatch).toBeCalledTimes(2)
    expect(spyOnDispatch).nthCalledWith(1, { type: REDUCE_ACTION_TYPE })
    expect(spyOnDispatch).nthCalledWith(2, {
      type: HYDRATE_ACTION_TYPE,
      payload: { reducer1: { value: 1 }, reducer2: { value: 1 } },
    })

    spyOnDispatch.mockClear()

    const nextState = { reducer1: { value: 2 }, reducer3: { value: 2 } }

    const result = await WrappedApp.getInitialProps?.({ Component: WrappedPage2, ctx: { isApp: true } } as any)
    expect(result).toEqual({ pageProps: { test: 123 } })

    act(() => {
      renderResult.rerender(
        <WrappedApp Component={WrappedPage2} router={{} as any} pageProps={{ __eggsState: nextState }} />,
      )
    })

    expect(spyOnDispatch).toBeCalledTimes(2)
    expect(spyOnDispatch).nthCalledWith(1, { type: REDUCE_ACTION_TYPE })
    expect(spyOnDispatch).nthCalledWith(1, { type: REDUCE_ACTION_TYPE })

    spyOnDispatch.mockClear()

    act(() => {
      renderResult.rerender(
        <WrappedApp
          Component={WrappedPage1}
          router={{} as any}
          pageProps={{ __eggsState: { reducer1: { value: 1 }, reducer2: { value: 1 } } }}
        />,
      )
    })

    expect(spyOnDispatch).toBeCalledTimes(3)
    expect(spyOnDispatch).nthCalledWith(1, { type: REDUCE_ACTION_TYPE })
    expect(spyOnDispatch).nthCalledWith(2, {
      type: HYDRATE_ACTION_TYPE,
      payload: { reducer1: { value: 1 }, reducer2: { value: 1 } },
    })
    expect(spyOnDispatch).nthCalledWith(3, { type: REDUCE_ACTION_TYPE })
  })

  test('Undefined `InitialPagePropsFn` should work', async () => {
    const wrapperInitializer = createWrapperInitializer(createAnyStore)

    const WrappedApp: AppType = wrapperInitializer.getAppWrapper().wrapApp(() => null)

    act(() => {
      render(<WrappedApp Component={() => null} router={{} as any} pageProps={{}} />)
    })

    const pageWrapper = wrapperInitializer.getPageWrapper()
    const WrappedPage: NextPage = pageWrapper.wrapPage(() => null)
    WrappedPage.getInitialProps = pageWrapper.wrapGetInitialProps()

    const result = await WrappedPage.getInitialProps?.({} as any)

    expect(result).toEqual({})
  })

  test('Empty object as `InitialPagePropsFn` should work', async () => {
    const wrapperInitializer = createWrapperInitializer(createAnyStore)

    const WrappedApp: AppType = wrapperInitializer.getAppWrapper().wrapApp(() => null)

    act(() => {
      render(<WrappedApp Component={() => null} router={{} as any} pageProps={{}} />)
    })

    const pageWrapper = wrapperInitializer.getPageWrapper()
    const WrappedPage: NextPage = pageWrapper.wrapPage(() => null)
    WrappedPage.getInitialProps = pageWrapper.wrapGetInitialProps({})

    const result = await WrappedPage.getInitialProps?.({} as any)

    expect(result).toEqual({})
  })

  test('Non-empty object as `InitialPagePropsFn` should work', async () => {
    const wrapperInitializer = createWrapperInitializer(createAnyStore)

    const WrappedApp: AppType = wrapperInitializer.getAppWrapper().wrapApp(() => null)

    act(() => {
      render(<WrappedApp Component={() => null} router={{} as any} pageProps={{}} />)
    })

    const pageWrapper = wrapperInitializer.getPageWrapper()
    const WrappedPage: NextPage = pageWrapper.wrapPage(() => null)
    WrappedPage.getInitialProps = pageWrapper.wrapGetInitialProps({ test: 123 })

    const result = await WrappedPage.getInitialProps?.({} as any)

    expect(result).toEqual({ test: 123 })
  })

  test('`InitialPagePropsFn` as function with empty result object', async () => {
    const wrapperInitializer = createWrapperInitializer(createAnyStore)

    const WrappedApp: AppType = wrapperInitializer.getAppWrapper().wrapApp(() => null)

    act(() => {
      render(<WrappedApp Component={() => null} router={{} as any} pageProps={{}} />)
    })

    const pageWrapper = wrapperInitializer.getPageWrapper()
    const WrappedPage: NextPage = pageWrapper.wrapPage(() => null)
    WrappedPage.getInitialProps = pageWrapper.wrapGetInitialProps(() => () => ({}))

    const result = await WrappedPage.getInitialProps?.({} as any)

    expect(result).toEqual({})
  })

  test('`InitialPagePropsFn` as function with non-empty result object', async () => {
    const wrapperInitializer = createWrapperInitializer(createAnyStore)

    const WrappedApp: AppType = wrapperInitializer.getAppWrapper().wrapApp(() => null)

    act(() => {
      render(<WrappedApp Component={() => null} router={{} as any} pageProps={{}} />)
    })

    const pageWrapper = wrapperInitializer.getPageWrapper()
    const WrappedPage: NextPage = pageWrapper.wrapPage(() => null)
    WrappedPage.getInitialProps = pageWrapper.wrapGetInitialProps(() => () => ({ test: 123 }))

    const result = await WrappedPage.getInitialProps?.({} as any)

    expect(result).toEqual({ test: 123 })
  })

  test('`createWrapperInitializer` supports custom hydration action type', () => {
    const store = createAnyStore({ combiner: getSimpleCombiner() })
    const storeCreator = () => store

    const spyOnDispatch = jest.spyOn(store, 'dispatch')

    const wrapperInitializer = createWrapperInitializer(storeCreator, { hydrationActionType: 'CUSTOM' })

    const App: AppType = () => null
    const appWrapper = wrapperInitializer.getAppWrapper([egg1])
    App.getInitialProps = appWrapper.wrapGetInitialProps(() => context => NextApp.getInitialProps(context))
    const WrappedApp = appWrapper.wrapApp(App)

    act(() => {
      render(
        <WrappedApp
          Component={() => null}
          router={{} as any}
          pageProps={{ __eggsState: { reducer1: { value: 1 } } }}
        />,
      )
    })

    expect(spyOnDispatch).toBeCalledTimes(2)
    expect(spyOnDispatch).nthCalledWith(1, { type: REDUCE_ACTION_TYPE })
    expect(spyOnDispatch).nthCalledWith(2, { type: 'CUSTOM', payload: { reducer1: { value: 1 } } })
  })
})
