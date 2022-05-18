/**
 * @jest-environment node
 */

import type { Egg } from '@redux-eggs/core'
import { createStore } from '@redux-eggs/redux'
import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  InferGetServerSidePropsType,
  InferGetStaticPropsType,
  NextPage,
} from 'next'
import NextApp from 'next/app'
import type { AppInitialProps, AppType } from 'next/dist/shared/lib/utils'
import React from 'react'
import { Provider } from 'react-redux'
import TestRenderer from 'react-test-renderer'

import type { InferGetStaticPathsQueryType } from '@/contracts'
import type { EggsConfig } from '@/contracts-internal'
import { createWrapperInitializer } from '@/server'

describe('Next Eggs Wrapper tests (Server-side)', () => {
  describe('`createWrapperInitializer` tests', () => {
    const createAnyStore = () => createStore()

    const egg1: Egg = { id: 'egg1', reducersMap: { reducer1: (state = {}) => state } }
    const egg2: Egg = { id: 'egg2', reducersMap: { reducer2: (state = {}) => state } }
    const egg3: Egg = { id: 'egg3', reducersMap: { reducer3: (state = {}) => state } }
    const egg4: Egg = { id: 'egg4', reducersMap: { reducer4: (state = {}) => state } }
    const egg5: Egg = { id: 'egg5', reducersMap: { reducer5: (state = {}) => state } }

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

    describe('Tests for initial eggs concatenation', () => {
      describe('Wrapped App with GIP and Page with GIP', () => {
        test('Unwrapped page', async () => {
          const store = createAnyStore()
          const storeCreator = () => store

          const spyOnAddEggs = jest.spyOn(store, 'addEggs')

          const wrapperInitializer = createWrapperInitializer(storeCreator)

          const App: AppType = () => null
          const appWrapper = wrapperInitializer.getAppWrapper()
          App.getInitialProps = appWrapper.wrapGetInitialProps(() => context => NextApp.getInitialProps(context))
          const WrappedApp = appWrapper.wrapApp(App)

          const Page = () => null
          const pageWrapper = wrapperInitializer.getPageWrapper()
          Page.getInitialProps = pageWrapper.wrapGetInitialProps()

          await WrappedApp.getInitialProps?.({ Component: Page, ctx: {} } as any)

          expect((Page as EggsConfig).__eggs).toBeUndefined()
          expect(spyOnAddEggs).toBeCalledTimes(1)
          expect(spyOnAddEggs).toBeCalledWith([])
          expect(Object.keys(store.getState())).toEqual([])
        })

        test('Eggs: `undefined`', async () => {
          const store = createAnyStore()
          const storeCreator = () => store

          const spyOnAddEggs = jest.spyOn(store, 'addEggs')

          const wrapperInitializer = createWrapperInitializer(storeCreator)

          const App: AppType = () => null
          const appWrapper = wrapperInitializer.getAppWrapper()
          App.getInitialProps = appWrapper.wrapGetInitialProps(() => context => NextApp.getInitialProps(context))
          const WrappedApp = appWrapper.wrapApp(App)

          const Page = () => null
          const pageWrapper = wrapperInitializer.getPageWrapper()
          Page.getInitialProps = pageWrapper.wrapGetInitialProps()
          const WrappedPage = pageWrapper.wrapPage(Page)

          await WrappedApp.getInitialProps?.({ Component: WrappedPage, ctx: {} } as any)

          expect((WrappedPage as EggsConfig).__eggs).toEqual([])
          expect(spyOnAddEggs).toBeCalledTimes(1)
          expect(spyOnAddEggs).toBeCalledWith([])
          expect(Object.keys(store.getState())).toEqual([])
        })

        test('Eggs: `[]`', async () => {
          const store = createAnyStore()
          const storeCreator = () => store

          const spyOnAddEggs = jest.spyOn(store, 'addEggs')

          const wrapperInitializer = createWrapperInitializer(storeCreator)

          const App: AppType = () => null
          const appWrapper = wrapperInitializer.getAppWrapper([])
          App.getInitialProps = appWrapper.wrapGetInitialProps(() => context => NextApp.getInitialProps(context))
          const WrappedApp = appWrapper.wrapApp(App)

          const Page = () => null
          const pageWrapper = wrapperInitializer.getPageWrapper([])
          Page.getInitialProps = pageWrapper.wrapGetInitialProps()
          const WrappedPage = pageWrapper.wrapPage(Page)

          await WrappedApp.getInitialProps?.({ Component: WrappedPage, ctx: {} } as any)

          expect((WrappedPage as EggsConfig).__eggs).toEqual([])
          expect(spyOnAddEggs).toBeCalledTimes(1)
          expect(spyOnAddEggs).toBeCalledWith([])
          expect(Object.keys(store.getState())).toEqual([])
        })

        test('Eggs: `Egg[]`', async () => {
          const store = createAnyStore()
          const storeCreator = () => store

          const spyOnAddEggs = jest.spyOn(store, 'addEggs')

          const wrapperInitializer = createWrapperInitializer(storeCreator)

          const App: AppType = () => null
          const appWrapper = wrapperInitializer.getAppWrapper([egg1])
          App.getInitialProps = appWrapper.wrapGetInitialProps(() => context => NextApp.getInitialProps(context))
          const WrappedApp = appWrapper.wrapApp(App)

          const Page = () => null
          const pageWrapper = wrapperInitializer.getPageWrapper([egg2, egg3])
          Page.getInitialProps = pageWrapper.wrapGetInitialProps()
          const WrappedPage = pageWrapper.wrapPage(Page)

          await WrappedApp.getInitialProps?.({ Component: WrappedPage, ctx: {} } as any)

          expect((WrappedPage as EggsConfig).__eggs).toEqual([egg2, egg3])
          expect(spyOnAddEggs).toBeCalledTimes(1)
          expect(spyOnAddEggs).toBeCalledWith([egg1, egg2, egg3])
          expect(Object.keys(store.getState())).toEqual(['reducer1', 'reducer2', 'reducer3'])
        })

        test('Eggs: `EggTuple`', async () => {
          const store = createAnyStore()
          const storeCreator = () => store

          const spyOnAddEggs = jest.spyOn(store, 'addEggs')

          const wrapperInitializer = createWrapperInitializer(storeCreator)

          const App: AppType = () => null
          const appWrapper = wrapperInitializer.getAppWrapper([egg1, [egg2, egg3]])
          App.getInitialProps = appWrapper.wrapGetInitialProps(() => context => NextApp.getInitialProps(context))
          const WrappedApp = appWrapper.wrapApp(App)

          const Page = () => null
          const pageWrapper = wrapperInitializer.getPageWrapper([[[egg4], [[[egg5]]]]])
          Page.getInitialProps = pageWrapper.wrapGetInitialProps()
          const WrappedPage = pageWrapper.wrapPage(Page)

          await WrappedApp.getInitialProps?.({ Component: WrappedPage, ctx: {} } as any)

          expect((WrappedPage as EggsConfig).__eggs).toEqual([[[egg4], [[[egg5]]]]])
          expect(spyOnAddEggs).toBeCalledTimes(1)
          expect(spyOnAddEggs).toBeCalledWith([egg1, [egg2, egg3], [[egg4], [[[egg5]]]]])
          expect(Object.keys(store.getState())).toEqual(['reducer1', 'reducer2', 'reducer3', 'reducer4', 'reducer5'])
        })

        test('Eggs: App eggs = `Egg[]`, Page eggs = `[]`', async () => {
          const store = createAnyStore()
          const storeCreator = () => store

          const spyOnAddEggs = jest.spyOn(store, 'addEggs')

          const wrapperInitializer = createWrapperInitializer(storeCreator)

          const App: AppType = () => null
          const appWrapper = wrapperInitializer.getAppWrapper([egg1])
          App.getInitialProps = appWrapper.wrapGetInitialProps(() => context => NextApp.getInitialProps(context))
          const WrappedApp = appWrapper.wrapApp(App)

          const Page = () => null
          const pageWrapper = wrapperInitializer.getPageWrapper()
          Page.getInitialProps = pageWrapper.wrapGetInitialProps()
          const WrappedPage = pageWrapper.wrapPage(Page)

          await WrappedApp.getInitialProps?.({ Component: WrappedPage, ctx: {} } as any)

          expect((WrappedPage as EggsConfig).__eggs).toEqual([])
          expect(spyOnAddEggs).toBeCalledTimes(1)
          expect(spyOnAddEggs).toBeCalledWith([egg1])
          expect(Object.keys(store.getState())).toEqual(['reducer1'])
        })

        test('Eggs: App eggs = `[]`, Page eggs = `Egg[]`', async () => {
          const store = createAnyStore()
          const storeCreator = () => store

          const spyOnAddEggs = jest.spyOn(store, 'addEggs')

          const wrapperInitializer = createWrapperInitializer(storeCreator)

          const App: AppType = () => null
          const appWrapper = wrapperInitializer.getAppWrapper()
          App.getInitialProps = appWrapper.wrapGetInitialProps(() => context => NextApp.getInitialProps(context))
          const WrappedApp = appWrapper.wrapApp(App)

          const Page = () => null
          const pageWrapper = wrapperInitializer.getPageWrapper([egg5])
          Page.getInitialProps = pageWrapper.wrapGetInitialProps()
          const WrappedPage = pageWrapper.wrapPage(Page)

          await WrappedApp.getInitialProps?.({ Component: WrappedPage, ctx: {} } as any)

          expect((WrappedPage as EggsConfig).__eggs).toEqual([egg5])
          expect(spyOnAddEggs).toBeCalledTimes(1)
          expect(spyOnAddEggs).toBeCalledWith([egg5])
          expect(Object.keys(store.getState())).toEqual(['reducer5'])
        })
      })

      describe('Wrapped App without GIP and Page with GIP', () => {
        test('Unwrapped page', async () => {
          const store = createAnyStore()
          const storeCreator = () => store

          const spyOnAddEggs = jest.spyOn(store, 'addEggs')

          const wrapperInitializer = createWrapperInitializer(storeCreator)
          wrapperInitializer.getAppWrapper().wrapApp(() => null)

          const Page = () => null
          const pageWrapper = wrapperInitializer.getPageWrapper()
          Page.getInitialProps = pageWrapper.wrapGetInitialProps()

          await Page.getInitialProps({} as any)

          expect((Page as EggsConfig).__eggs).toBeUndefined()
          expect(spyOnAddEggs).toBeCalledTimes(1)
          expect(spyOnAddEggs).toBeCalledWith([])
          expect(Object.keys(store.getState())).toEqual([])
        })

        test('Eggs: `undefined`', async () => {
          const store = createAnyStore()
          const storeCreator = () => store

          const spyOnAddEggs = jest.spyOn(store, 'addEggs')

          const wrapperInitializer = createWrapperInitializer(storeCreator)
          wrapperInitializer.getAppWrapper().wrapApp(() => null)

          const Page = () => null
          const pageWrapper = wrapperInitializer.getPageWrapper()
          Page.getInitialProps = pageWrapper.wrapGetInitialProps()
          const WrappedPage = pageWrapper.wrapPage(Page)

          await WrappedPage.getInitialProps({} as any)

          expect((WrappedPage as EggsConfig).__eggs).toEqual([])
          expect(spyOnAddEggs).toBeCalledTimes(1)
          expect(spyOnAddEggs).toBeCalledWith([])
          expect(Object.keys(store.getState())).toEqual([])
        })

        test('Eggs: `[]`', async () => {
          const store = createAnyStore()
          const storeCreator = () => store

          const spyOnAddEggs = jest.spyOn(store, 'addEggs')

          const wrapperInitializer = createWrapperInitializer(storeCreator)
          wrapperInitializer.getAppWrapper().wrapApp(() => null)

          const Page = () => null
          const pageWrapper = wrapperInitializer.getPageWrapper([])
          Page.getInitialProps = pageWrapper.wrapGetInitialProps()
          const WrappedPage = pageWrapper.wrapPage(Page)

          await WrappedPage.getInitialProps({} as any)

          expect((WrappedPage as EggsConfig).__eggs).toEqual([])
          expect(spyOnAddEggs).toBeCalledTimes(1)
          expect(spyOnAddEggs).toBeCalledWith([])
          expect(Object.keys(store.getState())).toEqual([])
        })

        test('Eggs: `Egg[]`', async () => {
          const store = createAnyStore()
          const storeCreator = () => store

          const spyOnAddEggs = jest.spyOn(store, 'addEggs')

          const wrapperInitializer = createWrapperInitializer(storeCreator)
          wrapperInitializer.getAppWrapper([egg1]).wrapApp(() => null)

          const Page = () => null
          const pageWrapper = wrapperInitializer.getPageWrapper([egg2, egg3])
          Page.getInitialProps = pageWrapper.wrapGetInitialProps()
          const WrappedPage = pageWrapper.wrapPage(Page)

          await WrappedPage.getInitialProps({} as any)

          expect((WrappedPage as EggsConfig).__eggs).toEqual([egg2, egg3])
          expect(spyOnAddEggs).toBeCalledTimes(1)
          expect(spyOnAddEggs).toBeCalledWith([egg1, egg2, egg3])
          expect(Object.keys(store.getState())).toEqual(['reducer1', 'reducer2', 'reducer3'])
        })

        test('Eggs: `EggTuple`', async () => {
          const store = createAnyStore()
          const storeCreator = () => store

          const spyOnAddEggs = jest.spyOn(store, 'addEggs')

          const wrapperInitializer = createWrapperInitializer(storeCreator)
          wrapperInitializer.getAppWrapper([egg1, [egg2, egg3]]).wrapApp(() => null)

          const Page = () => null
          const pageWrapper = wrapperInitializer.getPageWrapper([[[egg4], [[[egg5]]]]])
          Page.getInitialProps = pageWrapper.wrapGetInitialProps()
          const WrappedPage = pageWrapper.wrapPage(Page)

          await WrappedPage.getInitialProps({} as any)

          expect((WrappedPage as EggsConfig).__eggs).toEqual([[[egg4], [[[egg5]]]]])
          expect(spyOnAddEggs).toBeCalledTimes(1)
          expect(spyOnAddEggs).toBeCalledWith([egg1, [egg2, egg3], [[egg4], [[[egg5]]]]])
          expect(Object.keys(store.getState())).toEqual(['reducer1', 'reducer2', 'reducer3', 'reducer4', 'reducer5'])
        })

        test('Eggs: App eggs = `Egg[]`, Page eggs = `[]`', async () => {
          const store = createAnyStore()
          const storeCreator = () => store

          const spyOnAddEggs = jest.spyOn(store, 'addEggs')

          const wrapperInitializer = createWrapperInitializer(storeCreator)
          wrapperInitializer.getAppWrapper([egg1]).wrapApp(() => null)

          const Page = () => null
          const pageWrapper = wrapperInitializer.getPageWrapper()
          Page.getInitialProps = pageWrapper.wrapGetInitialProps()
          const WrappedPage = pageWrapper.wrapPage(Page)

          await WrappedPage.getInitialProps({} as any)

          expect((WrappedPage as EggsConfig).__eggs).toEqual([])
          expect(spyOnAddEggs).toBeCalledTimes(1)
          expect(spyOnAddEggs).toBeCalledWith([egg1])
          expect(Object.keys(store.getState())).toEqual(['reducer1'])
        })

        test('Eggs: App eggs = `[]`, Page eggs = `Egg[]`', async () => {
          const store = createAnyStore()
          const storeCreator = () => store

          const spyOnAddEggs = jest.spyOn(store, 'addEggs')

          const wrapperInitializer = createWrapperInitializer(storeCreator)
          wrapperInitializer.getAppWrapper().wrapApp(() => null)

          const Page = () => null
          const pageWrapper = wrapperInitializer.getPageWrapper([egg5])
          Page.getInitialProps = pageWrapper.wrapGetInitialProps()
          const WrappedPage = pageWrapper.wrapPage(Page)

          await WrappedPage.getInitialProps({} as any)

          expect((WrappedPage as EggsConfig).__eggs).toEqual([egg5])
          expect(spyOnAddEggs).toBeCalledTimes(1)
          expect(spyOnAddEggs).toBeCalledWith([egg5])
          expect(Object.keys(store.getState())).toEqual(['reducer5'])
        })
      })

      describe('Wrapped App with GIP and Page with GSP', () => {
        test('Eggs: `undefined`', async () => {
          const store = createAnyStore()
          const storeCreator = () => store

          const spyOnAddEggs = jest.spyOn(store, 'addEggs')

          const wrapperInitializer = createWrapperInitializer(storeCreator)

          const App: AppType = () => null
          const appWrapper = wrapperInitializer.getAppWrapper()
          App.getInitialProps = appWrapper.wrapGetInitialProps(() => context => NextApp.getInitialProps(context))
          const WrappedApp = appWrapper.wrapApp(App)

          const pageWrapper = wrapperInitializer.getPageWrapper()
          const gsp = pageWrapper.wrapGetStaticProps()
          const WrappedPage = pageWrapper.wrapPage(() => null)

          await WrappedApp.getInitialProps?.({ Component: WrappedPage, ctx: {} } as any)
          await gsp({} as any)

          expect((WrappedPage as EggsConfig).__eggs).toEqual([])
          expect(spyOnAddEggs).toBeCalledTimes(1)
          expect(spyOnAddEggs).toBeCalledWith([])
          expect(Object.keys(store.getState())).toEqual([])
        })

        test('Eggs: `[]`', async () => {
          const store = createAnyStore()
          const storeCreator = () => store

          const spyOnAddEggs = jest.spyOn(store, 'addEggs')

          const wrapperInitializer = createWrapperInitializer(storeCreator)

          const App: AppType = () => null
          const appWrapper = wrapperInitializer.getAppWrapper([])
          App.getInitialProps = appWrapper.wrapGetInitialProps(() => context => NextApp.getInitialProps(context))
          const WrappedApp = appWrapper.wrapApp(App)

          const pageWrapper = wrapperInitializer.getPageWrapper([])
          const gsp = pageWrapper.wrapGetStaticProps()
          const WrappedPage = pageWrapper.wrapPage(() => null)

          await WrappedApp.getInitialProps?.({ Component: WrappedPage, ctx: {} } as any)
          await gsp({} as any)

          expect((WrappedPage as EggsConfig).__eggs).toEqual([])
          expect(spyOnAddEggs).toBeCalledTimes(1)
          expect(spyOnAddEggs).toBeCalledWith([])
          expect(Object.keys(store.getState())).toEqual([])
        })

        test('Eggs: `Egg[]`', async () => {
          const store = createAnyStore()
          const storeCreator = () => store

          const spyOnAddEggs = jest.spyOn(store, 'addEggs')

          const wrapperInitializer = createWrapperInitializer(storeCreator)

          const App: AppType = () => null
          const appWrapper = wrapperInitializer.getAppWrapper([egg1])
          App.getInitialProps = appWrapper.wrapGetInitialProps(() => context => NextApp.getInitialProps(context))
          const WrappedApp = appWrapper.wrapApp(App)

          const pageWrapper = wrapperInitializer.getPageWrapper([egg2, egg3])
          const gsp = pageWrapper.wrapGetStaticProps()
          const WrappedPage = pageWrapper.wrapPage(() => null)

          await WrappedApp.getInitialProps?.({ Component: WrappedPage, ctx: {} } as any)
          await gsp({} as any)

          expect((WrappedPage as EggsConfig).__eggs).toEqual([egg2, egg3])
          expect(spyOnAddEggs).toBeCalledTimes(1)
          expect(spyOnAddEggs).toBeCalledWith([egg1, egg2, egg3])
          expect(Object.keys(store.getState())).toEqual(['reducer1', 'reducer2', 'reducer3'])
        })

        test('Eggs: `EggTuple`', async () => {
          const store = createAnyStore()
          const storeCreator = () => store

          const spyOnAddEggs = jest.spyOn(store, 'addEggs')

          const wrapperInitializer = createWrapperInitializer(storeCreator)

          const App: AppType = () => null
          const appWrapper = wrapperInitializer.getAppWrapper([egg1, [egg2, egg3]])
          App.getInitialProps = appWrapper.wrapGetInitialProps(() => context => NextApp.getInitialProps(context))
          const WrappedApp = appWrapper.wrapApp(App)

          const pageWrapper = wrapperInitializer.getPageWrapper([[[egg4], [[[egg5]]]]])
          const gsp = pageWrapper.wrapGetStaticProps()
          const WrappedPage = pageWrapper.wrapPage(() => null)

          await WrappedApp.getInitialProps?.({ Component: WrappedPage, ctx: {} } as any)
          await gsp({} as any)

          expect((WrappedPage as EggsConfig).__eggs).toEqual([[[egg4], [[[egg5]]]]])
          expect(spyOnAddEggs).toBeCalledTimes(1)
          expect(spyOnAddEggs).toBeCalledWith([egg1, [egg2, egg3], [[egg4], [[[egg5]]]]])
          expect(Object.keys(store.getState())).toEqual(['reducer1', 'reducer2', 'reducer3', 'reducer4', 'reducer5'])
        })

        test('Eggs: App eggs = `Egg[]`, Page eggs = `[]`', async () => {
          const store = createAnyStore()
          const storeCreator = () => store

          const spyOnAddEggs = jest.spyOn(store, 'addEggs')

          const wrapperInitializer = createWrapperInitializer(storeCreator)

          const App: AppType = () => null
          const appWrapper = wrapperInitializer.getAppWrapper([egg1])
          App.getInitialProps = appWrapper.wrapGetInitialProps(() => context => NextApp.getInitialProps(context))
          const WrappedApp = appWrapper.wrapApp(App)

          const pageWrapper = wrapperInitializer.getPageWrapper()
          const gsp = pageWrapper.wrapGetStaticProps()
          const WrappedPage = pageWrapper.wrapPage(() => null)

          await WrappedApp.getInitialProps?.({ Component: WrappedPage, ctx: {} } as any)
          await gsp({} as any)

          expect((WrappedPage as EggsConfig).__eggs).toEqual([])
          expect(spyOnAddEggs).toBeCalledTimes(1)
          expect(spyOnAddEggs).toBeCalledWith([egg1])
          expect(Object.keys(store.getState())).toEqual(['reducer1'])
        })

        test('Eggs: App eggs = `[]`, Page eggs = `Egg[]`', async () => {
          const store = createAnyStore()
          const storeCreator = () => store

          const spyOnAddEggs = jest.spyOn(store, 'addEggs')

          const wrapperInitializer = createWrapperInitializer(storeCreator)

          const App: AppType = () => null
          const appWrapper = wrapperInitializer.getAppWrapper()
          App.getInitialProps = appWrapper.wrapGetInitialProps(() => context => NextApp.getInitialProps(context))
          const WrappedApp = appWrapper.wrapApp(App)

          const pageWrapper = wrapperInitializer.getPageWrapper([egg5])
          const gsp = pageWrapper.wrapGetStaticProps()
          const WrappedPage = pageWrapper.wrapPage(() => null)

          await WrappedApp.getInitialProps?.({ Component: WrappedPage, ctx: {} } as any)
          await gsp({} as any)

          expect((WrappedPage as EggsConfig).__eggs).toEqual([egg5])
          expect(spyOnAddEggs).toBeCalledTimes(1)
          expect(spyOnAddEggs).toBeCalledWith([egg5])
          expect(Object.keys(store.getState())).toEqual(['reducer5'])
        })
      })

      describe('Wrapped App without GIP and Page with GSP', () => {
        test('Eggs: `undefined`', async () => {
          const store = createAnyStore()
          const storeCreator = () => store

          const spyOnAddEggs = jest.spyOn(store, 'addEggs')

          const wrapperInitializer = createWrapperInitializer(storeCreator)
          wrapperInitializer.getAppWrapper().wrapApp(() => null)

          const pageWrapper = wrapperInitializer.getPageWrapper()
          const gsp = pageWrapper.wrapGetStaticProps()
          const WrappedPage = pageWrapper.wrapPage(() => null)

          await gsp({} as any)

          expect((WrappedPage as EggsConfig).__eggs).toEqual([])
          expect(spyOnAddEggs).toBeCalledTimes(1)
          expect(spyOnAddEggs).toBeCalledWith([])
          expect(Object.keys(store.getState())).toEqual([])
        })

        test('Eggs: `[]`', async () => {
          const store = createAnyStore()
          const storeCreator = () => store

          const spyOnAddEggs = jest.spyOn(store, 'addEggs')

          const wrapperInitializer = createWrapperInitializer(storeCreator)
          wrapperInitializer.getAppWrapper().wrapApp(() => null)

          const pageWrapper = wrapperInitializer.getPageWrapper([])
          const gsp = pageWrapper.wrapGetStaticProps()
          const WrappedPage = pageWrapper.wrapPage(() => null)

          await gsp({} as any)

          expect((WrappedPage as EggsConfig).__eggs).toEqual([])
          expect(spyOnAddEggs).toBeCalledTimes(1)
          expect(spyOnAddEggs).toBeCalledWith([])
          expect(Object.keys(store.getState())).toEqual([])
        })

        test('Eggs: `Egg[]`', async () => {
          const store = createAnyStore()
          const storeCreator = () => store

          const spyOnAddEggs = jest.spyOn(store, 'addEggs')

          const wrapperInitializer = createWrapperInitializer(storeCreator)
          wrapperInitializer.getAppWrapper([egg1]).wrapApp(() => null)

          const pageWrapper = wrapperInitializer.getPageWrapper([egg2, egg3])
          const gsp = pageWrapper.wrapGetStaticProps()
          const WrappedPage = pageWrapper.wrapPage(() => null)

          await gsp({} as any)

          expect((WrappedPage as EggsConfig).__eggs).toEqual([egg2, egg3])
          expect(spyOnAddEggs).toBeCalledTimes(1)
          expect(spyOnAddEggs).toBeCalledWith([egg1, egg2, egg3])
          expect(Object.keys(store.getState())).toEqual(['reducer1', 'reducer2', 'reducer3'])
        })

        test('Eggs: `EggTuple`', async () => {
          const store = createAnyStore()
          const storeCreator = () => store

          const spyOnAddEggs = jest.spyOn(store, 'addEggs')

          const wrapperInitializer = createWrapperInitializer(storeCreator)
          wrapperInitializer.getAppWrapper([egg1, [egg2, egg3]]).wrapApp(() => null)

          const pageWrapper = wrapperInitializer.getPageWrapper([[[egg4], [[[egg5]]]]])
          const gsp = pageWrapper.wrapGetStaticProps()
          const WrappedPage = pageWrapper.wrapPage(() => null)

          await gsp({} as any)

          expect((WrappedPage as EggsConfig).__eggs).toEqual([[[egg4], [[[egg5]]]]])
          expect(spyOnAddEggs).toBeCalledTimes(1)
          expect(spyOnAddEggs).toBeCalledWith([egg1, [egg2, egg3], [[egg4], [[[egg5]]]]])
          expect(Object.keys(store.getState())).toEqual(['reducer1', 'reducer2', 'reducer3', 'reducer4', 'reducer5'])
        })

        test('Eggs: App eggs = `Egg[]`, Page eggs = `[]`', async () => {
          const store = createAnyStore()
          const storeCreator = () => store

          const spyOnAddEggs = jest.spyOn(store, 'addEggs')

          const wrapperInitializer = createWrapperInitializer(storeCreator)
          wrapperInitializer.getAppWrapper([egg1]).wrapApp(() => null)

          const pageWrapper = wrapperInitializer.getPageWrapper()
          const gsp = pageWrapper.wrapGetStaticProps()
          const WrappedPage = pageWrapper.wrapPage(() => null)

          await gsp({} as any)

          expect((WrappedPage as EggsConfig).__eggs).toEqual([])
          expect(spyOnAddEggs).toBeCalledTimes(1)
          expect(spyOnAddEggs).toBeCalledWith([egg1])
          expect(Object.keys(store.getState())).toEqual(['reducer1'])
        })

        test('Eggs: App eggs = `[]`, Page eggs = `Egg[]`', async () => {
          const store = createAnyStore()
          const storeCreator = () => store

          const spyOnAddEggs = jest.spyOn(store, 'addEggs')

          const wrapperInitializer = createWrapperInitializer(storeCreator)
          wrapperInitializer.getAppWrapper().wrapApp(() => null)

          const pageWrapper = wrapperInitializer.getPageWrapper([egg5])
          const gsp = pageWrapper.wrapGetStaticProps()
          const WrappedPage = pageWrapper.wrapPage(() => null)

          await gsp({} as any)

          expect((WrappedPage as EggsConfig).__eggs).toEqual([egg5])
          expect(spyOnAddEggs).toBeCalledTimes(1)
          expect(spyOnAddEggs).toBeCalledWith([egg5])
          expect(Object.keys(store.getState())).toEqual(['reducer5'])
        })
      })

      describe('Wrapped App with GIP and Page with GSSP', () => {
        test('Eggs: `undefined`', async () => {
          const store = createAnyStore()
          const storeCreator = () => store

          const spyOnAddEggs = jest.spyOn(store, 'addEggs')

          const wrapperInitializer = createWrapperInitializer(storeCreator)

          const App: AppType = () => null
          const appWrapper = wrapperInitializer.getAppWrapper()
          App.getInitialProps = appWrapper.wrapGetInitialProps(() => context => NextApp.getInitialProps(context))
          const WrappedApp = appWrapper.wrapApp(App)

          const pageWrapper = wrapperInitializer.getPageWrapper()
          const gssp = pageWrapper.wrapGetServerSideProps()
          const WrappedPage = pageWrapper.wrapPage(() => null)

          await WrappedApp.getInitialProps?.({ Component: WrappedPage, ctx: {} } as any)
          await gssp({} as any)

          expect((WrappedPage as EggsConfig).__eggs).toEqual([])
          expect(spyOnAddEggs).toBeCalledTimes(1)
          expect(spyOnAddEggs).toBeCalledWith([])
          expect(Object.keys(store.getState())).toEqual([])
        })

        test('Eggs: `[]`', async () => {
          const store = createAnyStore()
          const storeCreator = () => store

          const spyOnAddEggs = jest.spyOn(store, 'addEggs')

          const wrapperInitializer = createWrapperInitializer(storeCreator)

          const App: AppType = () => null
          const appWrapper = wrapperInitializer.getAppWrapper([])
          App.getInitialProps = appWrapper.wrapGetInitialProps(() => context => NextApp.getInitialProps(context))
          const WrappedApp = appWrapper.wrapApp(App)

          const pageWrapper = wrapperInitializer.getPageWrapper([])
          const gssp = pageWrapper.wrapGetServerSideProps()
          const WrappedPage = pageWrapper.wrapPage(() => null)

          await WrappedApp.getInitialProps?.({ Component: WrappedPage, ctx: {} } as any)
          await gssp({} as any)

          expect((WrappedPage as EggsConfig).__eggs).toEqual([])
          expect(spyOnAddEggs).toBeCalledTimes(1)
          expect(spyOnAddEggs).toBeCalledWith([])
          expect(Object.keys(store.getState())).toEqual([])
        })

        test('Eggs: `Egg[]`', async () => {
          const store = createAnyStore()
          const storeCreator = () => store

          const spyOnAddEggs = jest.spyOn(store, 'addEggs')

          const wrapperInitializer = createWrapperInitializer(storeCreator)

          const App: AppType = () => null
          const appWrapper = wrapperInitializer.getAppWrapper([egg1])
          App.getInitialProps = appWrapper.wrapGetInitialProps(() => context => NextApp.getInitialProps(context))
          const WrappedApp = appWrapper.wrapApp(App)

          const pageWrapper = wrapperInitializer.getPageWrapper([egg2, egg3])
          const gssp = pageWrapper.wrapGetServerSideProps()
          const WrappedPage = pageWrapper.wrapPage(() => null)

          await WrappedApp.getInitialProps?.({ Component: WrappedPage, ctx: {} } as any)
          await gssp({} as any)

          expect((WrappedPage as EggsConfig).__eggs).toEqual([egg2, egg3])
          expect(spyOnAddEggs).toBeCalledTimes(1)
          expect(spyOnAddEggs).toBeCalledWith([egg1, egg2, egg3])
          expect(Object.keys(store.getState())).toEqual(['reducer1', 'reducer2', 'reducer3'])
        })

        test('Eggs: `EggTuple`', async () => {
          const store = createAnyStore()
          const storeCreator = () => store

          const spyOnAddEggs = jest.spyOn(store, 'addEggs')

          const wrapperInitializer = createWrapperInitializer(storeCreator)

          const App: AppType = () => null
          const appWrapper = wrapperInitializer.getAppWrapper([egg1, [egg2, egg3]])
          App.getInitialProps = appWrapper.wrapGetInitialProps(() => context => NextApp.getInitialProps(context))
          const WrappedApp = appWrapper.wrapApp(App)

          const pageWrapper = wrapperInitializer.getPageWrapper([[[egg4], [[[egg5]]]]])
          const gssp = pageWrapper.wrapGetServerSideProps()
          const WrappedPage = pageWrapper.wrapPage(() => null)

          await WrappedApp.getInitialProps?.({ Component: WrappedPage, ctx: {} } as any)
          await gssp({} as any)

          expect((WrappedPage as EggsConfig).__eggs).toEqual([[[egg4], [[[egg5]]]]])
          expect(spyOnAddEggs).toBeCalledTimes(1)
          expect(spyOnAddEggs).toBeCalledWith([egg1, [egg2, egg3], [[egg4], [[[egg5]]]]])
          expect(Object.keys(store.getState())).toEqual(['reducer1', 'reducer2', 'reducer3', 'reducer4', 'reducer5'])
        })

        test('Eggs: App eggs = `Egg[]`, Page eggs = `[]`', async () => {
          const store = createAnyStore()
          const storeCreator = () => store

          const spyOnAddEggs = jest.spyOn(store, 'addEggs')

          const wrapperInitializer = createWrapperInitializer(storeCreator)

          const App: AppType = () => null
          const appWrapper = wrapperInitializer.getAppWrapper([egg1])
          App.getInitialProps = appWrapper.wrapGetInitialProps(() => context => NextApp.getInitialProps(context))
          const WrappedApp = appWrapper.wrapApp(App)

          const pageWrapper = wrapperInitializer.getPageWrapper()
          const gssp = pageWrapper.wrapGetServerSideProps()
          const WrappedPage = pageWrapper.wrapPage(() => null)

          await WrappedApp.getInitialProps?.({ Component: WrappedPage, ctx: {} } as any)
          await gssp({} as any)

          expect((WrappedPage as EggsConfig).__eggs).toEqual([])
          expect(spyOnAddEggs).toBeCalledTimes(1)
          expect(spyOnAddEggs).toBeCalledWith([egg1])
          expect(Object.keys(store.getState())).toEqual(['reducer1'])
        })

        test('Eggs: App eggs = `[]`, Page eggs = `Egg[]`', async () => {
          const store = createAnyStore()
          const storeCreator = () => store

          const spyOnAddEggs = jest.spyOn(store, 'addEggs')

          const wrapperInitializer = createWrapperInitializer(storeCreator)

          const App: AppType = () => null
          const appWrapper = wrapperInitializer.getAppWrapper()
          App.getInitialProps = appWrapper.wrapGetInitialProps(() => context => NextApp.getInitialProps(context))
          const WrappedApp = appWrapper.wrapApp(App)

          const pageWrapper = wrapperInitializer.getPageWrapper([egg5])
          const gssp = pageWrapper.wrapGetServerSideProps()
          const WrappedPage = pageWrapper.wrapPage(() => null)

          await WrappedApp.getInitialProps?.({ Component: WrappedPage, ctx: {} } as any)
          await gssp({} as any)

          expect((WrappedPage as EggsConfig).__eggs).toEqual([egg5])
          expect(spyOnAddEggs).toBeCalledTimes(1)
          expect(spyOnAddEggs).toBeCalledWith([egg5])
          expect(Object.keys(store.getState())).toEqual(['reducer5'])
        })
      })

      describe('Wrapped App without GIP and Page with GSSP', () => {
        test('Eggs: `undefined`', async () => {
          const store = createAnyStore()
          const storeCreator = () => store

          const spyOnAddEggs = jest.spyOn(store, 'addEggs')

          const wrapperInitializer = createWrapperInitializer(storeCreator)
          wrapperInitializer.getAppWrapper().wrapApp(() => null)

          const pageWrapper = wrapperInitializer.getPageWrapper()
          const gssp = pageWrapper.wrapGetServerSideProps()
          const WrappedPage = pageWrapper.wrapPage(() => null)

          await gssp({} as any)

          expect((WrappedPage as EggsConfig).__eggs).toEqual([])
          expect(spyOnAddEggs).toBeCalledTimes(1)
          expect(spyOnAddEggs).toBeCalledWith([])
          expect(Object.keys(store.getState())).toEqual([])
        })

        test('Eggs: `[]`', async () => {
          const store = createAnyStore()
          const storeCreator = () => store

          const spyOnAddEggs = jest.spyOn(store, 'addEggs')

          const wrapperInitializer = createWrapperInitializer(storeCreator)
          wrapperInitializer.getAppWrapper().wrapApp(() => null)

          const pageWrapper = wrapperInitializer.getPageWrapper([])
          const gssp = pageWrapper.wrapGetServerSideProps()
          const WrappedPage = pageWrapper.wrapPage(() => null)

          await gssp({} as any)

          expect((WrappedPage as EggsConfig).__eggs).toEqual([])
          expect(spyOnAddEggs).toBeCalledTimes(1)
          expect(spyOnAddEggs).toBeCalledWith([])
          expect(Object.keys(store.getState())).toEqual([])
        })

        test('Eggs: `Egg[]`', async () => {
          const store = createAnyStore()
          const storeCreator = () => store

          const spyOnAddEggs = jest.spyOn(store, 'addEggs')

          const wrapperInitializer = createWrapperInitializer(storeCreator)
          wrapperInitializer.getAppWrapper([egg1]).wrapApp(() => null)

          const pageWrapper = wrapperInitializer.getPageWrapper([egg2, egg3])
          const gssp = pageWrapper.wrapGetServerSideProps()
          const WrappedPage = pageWrapper.wrapPage(() => null)

          await gssp({} as any)

          expect((WrappedPage as EggsConfig).__eggs).toEqual([egg2, egg3])
          expect(spyOnAddEggs).toBeCalledTimes(1)
          expect(spyOnAddEggs).toBeCalledWith([egg1, egg2, egg3])
          expect(Object.keys(store.getState())).toEqual(['reducer1', 'reducer2', 'reducer3'])
        })

        test('Eggs: `EggTuple`', async () => {
          const store = createAnyStore()
          const storeCreator = () => store

          const spyOnAddEggs = jest.spyOn(store, 'addEggs')

          const wrapperInitializer = createWrapperInitializer(storeCreator)
          wrapperInitializer.getAppWrapper([egg1, [egg2, egg3]]).wrapApp(() => null)

          const pageWrapper = wrapperInitializer.getPageWrapper([[[egg4], [[[egg5]]]]])
          const gssp = pageWrapper.wrapGetServerSideProps()
          const WrappedPage = pageWrapper.wrapPage(() => null)

          await gssp({} as any)

          expect((WrappedPage as EggsConfig).__eggs).toEqual([[[egg4], [[[egg5]]]]])
          expect(spyOnAddEggs).toBeCalledTimes(1)
          expect(spyOnAddEggs).toBeCalledWith([egg1, [egg2, egg3], [[egg4], [[[egg5]]]]])
          expect(Object.keys(store.getState())).toEqual(['reducer1', 'reducer2', 'reducer3', 'reducer4', 'reducer5'])
        })

        test('Eggs: App eggs = `Egg[]`, Page eggs = `[]`', async () => {
          const store = createAnyStore()
          const storeCreator = () => store

          const spyOnAddEggs = jest.spyOn(store, 'addEggs')

          const wrapperInitializer = createWrapperInitializer(storeCreator)
          wrapperInitializer.getAppWrapper([egg1]).wrapApp(() => null)

          const pageWrapper = wrapperInitializer.getPageWrapper()
          const gssp = pageWrapper.wrapGetServerSideProps()
          const WrappedPage = pageWrapper.wrapPage(() => null)

          await gssp({} as any)

          expect((WrappedPage as EggsConfig).__eggs).toEqual([])
          expect(spyOnAddEggs).toBeCalledTimes(1)
          expect(spyOnAddEggs).toBeCalledWith([egg1])
          expect(Object.keys(store.getState())).toEqual(['reducer1'])
        })

        test('Eggs: App eggs = `[]`, Page eggs = `Egg[]`', async () => {
          const store = createAnyStore()
          const storeCreator = () => store

          const spyOnAddEggs = jest.spyOn(store, 'addEggs')

          const wrapperInitializer = createWrapperInitializer(storeCreator)
          wrapperInitializer.getAppWrapper().wrapApp(() => null)

          const pageWrapper = wrapperInitializer.getPageWrapper([egg5])
          const gssp = pageWrapper.wrapGetServerSideProps()
          const WrappedPage = pageWrapper.wrapPage(() => null)

          await gssp({} as any)

          expect((WrappedPage as EggsConfig).__eggs).toEqual([egg5])
          expect(spyOnAddEggs).toBeCalledTimes(1)
          expect(spyOnAddEggs).toBeCalledWith([egg5])
          expect(Object.keys(store.getState())).toEqual(['reducer5'])
        })
      })
    })

    test('Wrapped App extend App GIP', () => {
      const wrapperInitializer = createWrapperInitializer(createAnyStore)

      const AppFnWithGip: AppType = () => null
      const appGip = async () => ({ pageProps: {} })
      AppFnWithGip.getInitialProps = appGip
      const WrappedAppFnWithGip = wrapperInitializer.getAppWrapper().wrapApp(AppFnWithGip)
      expect(WrappedAppFnWithGip.getInitialProps).toBe(appGip)

      const AppFnWithoutGip: AppType = () => null
      const WrappedAppFnWithoutGip = wrapperInitializer.getAppWrapper().wrapApp(AppFnWithoutGip)
      expect(WrappedAppFnWithoutGip.getInitialProps).toBeUndefined()

      class AppClassWithGip extends NextApp {
        static getInitialProps = appGip
        render = () => <div />
      }

      const WrappedAppClassWithGip = wrapperInitializer.getAppWrapper().wrapApp(AppClassWithGip as any)
      expect(WrappedAppClassWithGip.getInitialProps).toBe(appGip)

      class AppClassWithoutGip extends NextApp {
        render = () => <div />
      }

      const WrappedAppClassWithoutGip = wrapperInitializer.getAppWrapper().wrapApp(AppClassWithoutGip as any)
      expect(WrappedAppClassWithoutGip.getInitialProps).toBe(NextApp.getInitialProps)
    })

    test('App renders React-Redux Provider', () => {
      const store = createAnyStore()
      const storeCreator = () => store

      const wrapperInitializer = createWrapperInitializer(storeCreator)

      const WrappedApp = wrapperInitializer.getAppWrapper().wrapApp(() => null) as any

      let renderer = TestRenderer.create(<></>)

      TestRenderer.act(() => {
        renderer = TestRenderer.create(<WrappedApp />)
      })

      expect(renderer.root.findByType(Provider).props.store).toEqual(store)
    })

    test('App wrapper with GIP should wrap `next/app` correctly', async () => {
      const storeCreator = jest.fn(createAnyStore)
      const wrapperInitializer = createWrapperInitializer(storeCreator)

      expect(storeCreator).not.toBeCalled()

      const App: AppType = () => null
      const appWrapper = wrapperInitializer.getAppWrapper([egg1, [egg2], [[egg3]]])
      App.getInitialProps = appWrapper.wrapGetInitialProps(store => context => {
        store.addEggs([egg4])
        return NextApp.getInitialProps(context)
      })
      const WrappedApp: AppType = appWrapper.wrapApp(App)

      expect(storeCreator).not.toBeCalled()

      const Page: NextPage = () => null
      const pageWrapper = wrapperInitializer.getPageWrapper([egg5])
      const WrappedPage = pageWrapper.wrapPage(Page)

      const result: any = await WrappedApp.getInitialProps?.({ Component: WrappedPage, ctx: {} } as any)

      expect(storeCreator).toBeCalledTimes(1)
      expect(Object.keys(result?.pageProps.__eggsState)).toEqual([
        'reducer1',
        'reducer2',
        'reducer3',
        'reducer5',
        'reducer4',
      ])
    })

    test('Wrapped `GSP` should return props in default cases ', async () => {
      const store = createAnyStore()
      const storeCreator = () => store

      const spyOnAddEggs = jest.spyOn(store, 'addEggs')

      const wrapperInitializer = createWrapperInitializer(storeCreator)

      expect(spyOnAddEggs).not.toBeCalled()

      const gsp1 = wrapperInitializer.getPageWrapper().wrapGetStaticProps()
      expect(await gsp1({} as any)).toEqual({ props: { __eggsState: {} } })
      expect(spyOnAddEggs).toBeCalledTimes(1)
      expect(spyOnAddEggs).toBeCalledWith([])
      spyOnAddEggs.mockClear()

      const gsp2 = wrapperInitializer.getPageWrapper([]).wrapGetStaticProps({})
      expect(await gsp2({} as any)).toEqual({ props: { __eggsState: {} } })
      expect(spyOnAddEggs).toBeCalledTimes(1)
      expect(spyOnAddEggs).toBeCalledWith([])
      spyOnAddEggs.mockClear()

      const gsp3 = wrapperInitializer.getPageWrapper([egg1, egg2, egg3]).wrapGetStaticProps({ test: 123 })
      expect(await gsp3({} as any)).toEqual({
        props: {
          __eggsState: {
            reducer1: {},
            reducer2: {},
            reducer3: {},
          },
          test: 123,
        },
      })
      expect(spyOnAddEggs).toBeCalledTimes(1)
      expect(spyOnAddEggs).toBeCalledWith([egg1, egg2, egg3])
      spyOnAddEggs.mockClear()

      const gsp4 = wrapperInitializer.getPageWrapper([[egg4, [[[egg5]]]]]).wrapGetStaticProps(store => () => {
        store.addEggs([egg1, [egg2], [[[egg3]]]])
        return { props: { test: 123 } }
      })
      expect(await gsp4({} as any)).toEqual({
        props: {
          __eggsState: {
            reducer1: {},
            reducer2: {},
            reducer3: {},
            reducer4: {},
            reducer5: {},
          },
          test: 123,
        },
      })
      expect(spyOnAddEggs).toBeCalledTimes(2)
      expect(spyOnAddEggs).nthCalledWith(1, [[egg4, [[[egg5]]]]])
      expect(spyOnAddEggs).nthCalledWith(2, [egg1, [egg2], [[[egg3]]]])
      spyOnAddEggs.mockClear()
    })

    test('Wrapped `GSSP` should return props in default cases ', async () => {
      const store = createAnyStore()
      const storeCreator = () => store

      const spyOnAddEggs = jest.spyOn(store, 'addEggs')

      const wrapperInitializer = createWrapperInitializer(storeCreator)

      expect(spyOnAddEggs).not.toBeCalled()

      const gssp1 = wrapperInitializer.getPageWrapper().wrapGetServerSideProps()
      expect(await gssp1({} as any)).toEqual({ props: { __eggsState: {} } })
      expect(spyOnAddEggs).toBeCalledTimes(1)
      expect(spyOnAddEggs).toBeCalledWith([])
      spyOnAddEggs.mockClear()

      const gssp2 = wrapperInitializer.getPageWrapper([]).wrapGetServerSideProps({})
      expect(await gssp2({} as any)).toEqual({ props: { __eggsState: {} } })
      expect(spyOnAddEggs).toBeCalledTimes(1)
      expect(spyOnAddEggs).toBeCalledWith([])
      spyOnAddEggs.mockClear()

      const gssp3 = wrapperInitializer.getPageWrapper([egg1, egg2, egg3]).wrapGetServerSideProps({ test: 123 })
      expect(await gssp3({} as any)).toEqual({
        props: {
          __eggsState: {
            reducer1: {},
            reducer2: {},
            reducer3: {},
          },
          test: 123,
        },
      })
      expect(spyOnAddEggs).toBeCalledTimes(1)
      expect(spyOnAddEggs).toBeCalledWith([egg1, egg2, egg3])
      spyOnAddEggs.mockClear()

      const gssp4 = wrapperInitializer.getPageWrapper([[egg4, [egg5]]]).wrapGetServerSideProps(store => async () => {
        store.addEggs([egg1, [egg2], [[[egg3]]]])
        return { props: { test: 123 } }
      })
      expect(await gssp4({} as any)).toEqual({
        props: {
          __eggsState: {
            reducer1: {},
            reducer2: {},
            reducer3: {},
            reducer4: {},
            reducer5: {},
          },
          test: 123,
        },
      })
      expect(spyOnAddEggs).toBeCalledTimes(2)
      expect(spyOnAddEggs).nthCalledWith(1, [[egg4, [egg5]]])
      expect(spyOnAddEggs).nthCalledWith(2, [egg1, [egg2], [[[egg3]]]])
      spyOnAddEggs.mockClear()
    })

    test('Wrapped `GSP` should not return props if it is not provided in returned objects', async () => {
      const wrapperInitializer = createWrapperInitializer(createAnyStore)

      const gsp1 = wrapperInitializer.getPageWrapper().wrapGetStaticProps(() => () => ({ notFound: true }))
      expect(await gsp1({} as any)).toEqual({ notFound: true })

      const gsp2 = wrapperInitializer.getPageWrapper().wrapGetStaticProps(() => () => {
        return {
          redirect: {
            permanent: true,
            destination: '/',
          },
        }
      })
      expect(await gsp2({} as any)).toEqual({ redirect: { permanent: true, destination: '/' } })
    })

    test('Wrapped `GSSP` should not return props if it is not provided in returned objects', async () => {
      const wrapperInitializer = createWrapperInitializer(createAnyStore)

      const gssp1 = wrapperInitializer.getPageWrapper().wrapGetServerSideProps(() => async () => ({ notFound: true }))
      expect(await gssp1({} as any)).toEqual({ notFound: true })

      const gssp2 = wrapperInitializer.getPageWrapper().wrapGetServerSideProps(() => async () => {
        return {
          redirect: {
            permanent: true,
            destination: '/',
          },
        }
      })
      expect(await gssp2({} as any)).toEqual({ redirect: { permanent: true, destination: '/' } })
    })

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

      expect(storeCreator).not.toBeCalled()
      expect(beforeResult).not.toBeCalled()

      const anyAppContext = { Component: WrappedPage, isApp: true, ctx: {} }
      await WrappedApp.getInitialProps?.(anyAppContext as any)
      expect(spyOnWrappedPageGip).toBeCalledTimes(1)
      expect(storeCreator).toBeCalledTimes(1)
      expect(beforeResult).toBeCalledTimes(1)
      expect(beforeResult).toBeCalledWith(store, { context: anyAppContext })
    })

    test('`beforeResult` should be called once if App has GIP and page has `GSP`', async () => {
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
      const gsp = pageWrapper.wrapGetStaticProps({ test: 123 })
      const WrappedPage = pageWrapper.wrapPage(Page)

      expect(storeCreator).not.toBeCalled()
      expect(beforeResult).not.toBeCalled()

      const anyAppContext = { Component: WrappedPage, isApp: true, ctx: {} }
      await WrappedApp.getInitialProps?.(anyAppContext as any)
      expect(storeCreator).toBeCalledTimes(1)
      expect(beforeResult).not.toBeCalled()
      storeCreator.mockClear()

      const anyPageContext = { isPage: true }
      await gsp(anyPageContext as any)
      expect(storeCreator).not.toBeCalled()
      expect(beforeResult).toBeCalledTimes(1)
      expect(beforeResult).toBeCalledWith(store, { context: anyPageContext })
    })

    test('`beforeResult` should be called once if App has GIP and page has `GSSP`', async () => {
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
      const gssp = pageWrapper.wrapGetServerSideProps({ test: 123 })
      const WrappedPage = pageWrapper.wrapPage(Page)

      expect(storeCreator).not.toBeCalled()
      expect(beforeResult).not.toBeCalled()

      const anyAppContext = { Component: WrappedPage, isApp: true, ctx: {} }
      await WrappedApp.getInitialProps?.(anyAppContext as any)
      expect(storeCreator).toBeCalledTimes(1)
      expect(beforeResult).not.toBeCalled()
      storeCreator.mockClear()

      const anyPageContext = { isPage: true }
      await gssp(anyPageContext as any)
      expect(storeCreator).not.toBeCalled()
      expect(beforeResult).toBeCalledTimes(1)
      expect(beforeResult).toBeCalledWith(store, { context: anyPageContext })
    })

    test('`beforeResult` should be called once in Page GIP if App does not have GIP', async () => {
      const store = createAnyStore()
      const storeCreator = jest.fn(() => store)
      const beforeResult = jest.fn()

      const wrapperInitializer = createWrapperInitializer(storeCreator)
      wrapperInitializer.getAppWrapper([], { beforeResult }).wrapApp(() => null)

      const Page: NextPage = () => null
      const pageWrapper = wrapperInitializer.getPageWrapper()
      Page.getInitialProps = pageWrapper.wrapGetInitialProps(() => () => ({ test: 123 }))
      const WrappedPage = pageWrapper.wrapPage(Page)

      expect(storeCreator).not.toBeCalled()
      expect(beforeResult).not.toBeCalled()

      const anyPageContext = { isPage: true }
      await WrappedPage.getInitialProps?.(anyPageContext as any)
      expect(storeCreator).toBeCalledTimes(1)
      expect(beforeResult).toBeCalledTimes(1)
      expect(beforeResult).toBeCalledWith(store, { context: anyPageContext })
    })

    test('`beforeResult` should be called once in Page GSP if App does not have GIP', async () => {
      const store = createAnyStore()
      const storeCreator = jest.fn(() => store)
      const beforeResult = jest.fn()

      const wrapperInitializer = createWrapperInitializer(storeCreator)
      wrapperInitializer.getAppWrapper([], { beforeResult }).wrapApp(() => null)

      const pageWrapper = wrapperInitializer.getPageWrapper()
      pageWrapper.wrapPage(() => null)
      const gsp = pageWrapper.wrapGetStaticProps({ test: 123 })

      expect(storeCreator).not.toBeCalled()
      expect(beforeResult).not.toBeCalled()

      const anyPageContext = { isPage: true }
      await gsp(anyPageContext as any)
      expect(storeCreator).toBeCalledTimes(1)
      expect(beforeResult).toBeCalledTimes(1)
      expect(beforeResult).toBeCalledWith(store, { context: anyPageContext })
    })

    test('`beforeResult` should be called once in Page GSSP if App does not have GIP', async () => {
      const store = createAnyStore()
      const storeCreator = jest.fn(() => store)
      const beforeResult = jest.fn()

      const wrapperInitializer = createWrapperInitializer(storeCreator)
      wrapperInitializer.getAppWrapper([], { beforeResult }).wrapApp(() => null)

      const pageWrapper = wrapperInitializer.getPageWrapper()
      pageWrapper.wrapPage(() => null)
      const gssp = pageWrapper.wrapGetServerSideProps({ test: 123 })

      expect(storeCreator).not.toBeCalled()
      expect(beforeResult).not.toBeCalled()

      const anyPageContext = { isPage: true }
      await gssp(anyPageContext as any)
      expect(storeCreator).toBeCalledTimes(1)
      expect(beforeResult).toBeCalledTimes(1)
      expect(beforeResult).toBeCalledWith(store, { context: anyPageContext })
    })

    test('`getStaticPaths` creates separated store if App has GIP', async () => {
      let store = createAnyStore()
      let spyOnAddEggs = jest.spyOn(store, 'addEggs')
      const storeCreator = jest.fn(() => {
        store = createAnyStore()
        spyOnAddEggs = jest.spyOn(store, 'addEggs')
        return store
      })
      const beforeResult = jest.fn()

      const wrapperInitializer = createWrapperInitializer(storeCreator)

      const App: AppType = () => null
      const appWrapper = wrapperInitializer.getAppWrapper([egg1], { beforeResult })
      App.getInitialProps = appWrapper.wrapGetInitialProps(() => context => NextApp.getInitialProps(context))
      const WrappedApp = appWrapper.wrapApp(App)

      const pageWrapper = wrapperInitializer.getPageWrapper([egg2, egg3])
      const getStaticPaths = pageWrapper.wrapGetStaticPaths(store => async () => {
        store.addEggs([egg4, egg5])
        return {
          paths: [],
          fallback: false,
        }
      })
      const getStaticProps = pageWrapper.wrapGetStaticProps()
      const WrappedPage = pageWrapper.wrapPage(() => null)

      expect(storeCreator).not.toBeCalled()
      expect(beforeResult).not.toBeCalled()
      expect(spyOnAddEggs).not.toBeCalled()

      await getStaticPaths({ isGetStaticPaths: true } as any)
      expect(storeCreator).toBeCalledTimes(1)
      expect(beforeResult).toBeCalledTimes(1)
      expect(beforeResult).toBeCalledWith(store, { context: { isGetStaticPaths: true } })
      expect(spyOnAddEggs).toBeCalledTimes(1)
      expect(spyOnAddEggs).toBeCalledWith([egg4, egg5])
      expect(Object.keys(store.getState())).toEqual(['reducer4', 'reducer5'])
      storeCreator.mockClear()
      beforeResult.mockClear()
      spyOnAddEggs.mockClear()

      await WrappedApp.getInitialProps?.({ Component: WrappedPage, ctx: {} } as any)
      await getStaticProps({ isGetStaticProps: true } as any)

      expect((WrappedPage as EggsConfig).__eggs).toEqual([egg2, egg3])
      expect(storeCreator).toBeCalledTimes(1)
      expect(beforeResult).toBeCalledTimes(1)
      expect(beforeResult).toBeCalledWith(store, { context: { isGetStaticProps: true } })
      expect(spyOnAddEggs).toBeCalledTimes(1)
      expect(spyOnAddEggs).toBeCalledWith([egg1, egg2, egg3])
      expect(Object.keys(store.getState())).toEqual(['reducer1', 'reducer2', 'reducer3'])
    })

    test('`getStaticPaths` creates separated store if App has not GIP', async () => {
      let store = createAnyStore()
      let spyOnAddEggs = jest.spyOn(store, 'addEggs')
      const storeCreator = jest.fn(() => {
        store = createAnyStore()
        spyOnAddEggs = jest.spyOn(store, 'addEggs')
        return store
      })
      const beforeResult = jest.fn()

      const wrapperInitializer = createWrapperInitializer(storeCreator)
      wrapperInitializer.getAppWrapper([egg1], { beforeResult }).wrapApp(() => null)

      const pageWrapper = wrapperInitializer.getPageWrapper([egg2, egg3])
      const getStaticPaths = pageWrapper.wrapGetStaticPaths(store => async () => {
        store.addEggs([egg4, egg5])
        return {
          paths: [],
          fallback: false,
        }
      })
      const getStaticProps = pageWrapper.wrapGetStaticProps()
      const WrappedPage = pageWrapper.wrapPage(() => null)

      expect(storeCreator).not.toBeCalled()
      expect(beforeResult).not.toBeCalled()
      expect(spyOnAddEggs).not.toBeCalled()

      await getStaticPaths({ isGetStaticPaths: true } as any)
      expect(storeCreator).toBeCalledTimes(1)
      expect(beforeResult).toBeCalledTimes(1)
      expect(beforeResult).toBeCalledWith(store, { context: { isGetStaticPaths: true } })
      expect(spyOnAddEggs).toBeCalledTimes(1)
      expect(spyOnAddEggs).toBeCalledWith([egg4, egg5])
      expect(Object.keys(store.getState())).toEqual(['reducer4', 'reducer5'])
      storeCreator.mockClear()
      beforeResult.mockClear()
      spyOnAddEggs.mockClear()

      await getStaticProps({ isGetStaticProps: true } as any)

      expect((WrappedPage as EggsConfig).__eggs).toEqual([egg2, egg3])
      expect(storeCreator).toBeCalledTimes(1)
      expect(beforeResult).toBeCalledTimes(1)
      expect(beforeResult).toBeCalledWith(store, { context: { isGetStaticProps: true } })
      expect(spyOnAddEggs).toBeCalledTimes(1)
      expect(spyOnAddEggs).toBeCalledWith([egg1, egg2, egg3])
      expect(Object.keys(store.getState())).toEqual(['reducer1', 'reducer2', 'reducer3'])
    })
  })

  describe('Props and types tests', () => {
    const noop: (...args: any[]) => null = () => null

    type Props = { num: number }

    type NotAny<T, True, False = never> = true | false extends (T extends never ? true : false) ? False : True

    const wrapperInitializer = createWrapperInitializer(createStore)

    describe('Get Static Props', () => {
      test('Mixed `StaticPropsFn` without types for `GSP`', async () => {
        const PageComponent: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({ num }) => {
          const res: NotAny<typeof num, number> = num
          return noop(res)
        }

        const wrapper = wrapperInitializer.getPageWrapper()

        const getStaticPaths = wrapper.wrapGetStaticPaths(store => context => {
          store.dispatch({
            type: 'ANY_ACTION',
            payload: {
              defaultLocale: context.defaultLocale,
            },
          })

          return {
            paths: [
              {
                params: {
                  q: 'query',
                },
              },
            ],
            fallback: false,
          }
        })

        const getStaticProps = wrapper.wrapGetStaticProps(
          store => (context: GetStaticPropsContext<InferGetStaticPathsQueryType<typeof getStaticPaths>>) => {
            if (context.params?.q === '404') {
              return {
                notFound: true,
              }
            }

            if (context.params?.q === '308') {
              return {
                redirect: {
                  permanent: true,
                  destination: '/',
                },
                revalidate: 1,
              }
            }

            store.dispatch({
              type: 'ANY_ACTION',
              payload: {
                defaultLocale: context.defaultLocale,
              },
            })

            return {
              props: {
                num: 123,
              },
              revalidate: 1,
            }
          },
        )

        expect((wrapper.wrapPage(PageComponent) as EggsConfig).__eggs).toEqual([])
        expect(await getStaticPaths({} as any)).toEqual({ paths: [{ params: { q: 'query' } }], fallback: false })
        expect(await getStaticProps({} as any)).toEqual({ props: { __eggsState: {}, num: 123 }, revalidate: 1 })
      })

      test('Mixed `StaticPropsFn` with types for `GSP`', async () => {
        const PageComponent: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({ num }) => {
          const res: NotAny<typeof num, number> = num
          return noop(res)
        }

        const wrapper = wrapperInitializer.getPageWrapper()

        const getStaticPaths: GetStaticPaths<{ q?: string }> = wrapper.wrapGetStaticPaths(store => context => {
          store.dispatch({
            type: 'ANY_ACTION',
            payload: {
              defaultLocale: context.defaultLocale,
            },
          })

          return {
            paths: [
              {
                params: {
                  q: 'query',
                },
              },
            ],
            fallback: false,
          }
        })

        const getStaticProps: GetStaticProps<
          Props,
          InferGetStaticPathsQueryType<typeof getStaticPaths>
        > = wrapper.wrapGetStaticProps(() => context => {
          if (context.params?.q === '404') {
            return {
              notFound: true,
            }
          }

          if (context.params?.q === '308') {
            return {
              redirect: {
                permanent: true,
                destination: '/',
              },
              revalidate: 1,
            }
          }

          return {
            props: {
              num: 123,
            },
            revalidate: 1,
          }
        })

        expect((wrapper.wrapPage(PageComponent) as EggsConfig).__eggs).toEqual([])
        expect(await getStaticPaths({} as any)).toEqual({ paths: [{ params: { q: 'query' } }], fallback: false })
        expect(await getStaticProps({} as any)).toEqual({ props: { __eggsState: {}, num: 123 }, revalidate: 1 })
      })

      test('Empty props in `StaticPropsFn`', async () => {
        const PageComponent: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({ never }: any) => noop(never)

        const wrapper = wrapperInitializer.getPageWrapper()

        const getStaticProps = wrapper.wrapGetStaticProps(() => context => {
          if (context.params?.q === '404') {
            return {
              notFound: true,
            }
          }

          if (context.params?.q === '308') {
            return {
              redirect: {
                permanent: true,
                destination: '/',
              },
              revalidate: 1,
            }
          }

          return {
            props: {},
            revalidate: 1,
          }
        })

        expect((wrapper.wrapPage(PageComponent) as EggsConfig).__eggs).toEqual([])
        expect(await getStaticProps({} as any)).toEqual({ props: { __eggsState: {} }, revalidate: 1 })
      })

      test('Not empty object as `StaticPropsFn` without types for `GSP`', async () => {
        const PageComponent: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({ num }) => {
          const res: NotAny<typeof num, number> = num
          return noop(res)
        }

        const wrapper = wrapperInitializer.getPageWrapper()

        const getStaticProps = wrapper.wrapGetStaticProps({ num: 123 })

        expect((wrapper.wrapPage(PageComponent) as EggsConfig).__eggs).toEqual([])
        expect(await getStaticProps({} as any)).toEqual({ props: { __eggsState: {}, num: 123 } })
      })

      test('Not empty object as `StaticPropsFn` with types for `GSP`', async () => {
        const PageComponent: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({ num }) => {
          const res: NotAny<typeof num, number> = num
          return noop(res)
        }

        const wrapper = wrapperInitializer.getPageWrapper()

        const getStaticProps: GetStaticProps<Props> = wrapper.wrapGetStaticProps({ num: 123 })

        expect((wrapper.wrapPage(PageComponent) as EggsConfig).__eggs).toEqual([])
        expect(await getStaticProps({} as any)).toEqual({ props: { __eggsState: {}, num: 123 } })
      })

      test('Empty object as `StaticPropsFn`', async () => {
        const PageComponent: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({ never }: any) => noop(never)

        const wrapper = wrapperInitializer.getPageWrapper()

        const getStaticProps = wrapper.wrapGetStaticProps({})

        expect((wrapper.wrapPage(PageComponent) as EggsConfig).__eggs).toEqual([])
        expect(await getStaticProps({} as any)).toEqual({ props: { __eggsState: {} } })
      })

      test('Without `StaticPropsFn`', async () => {
        const PageComponent: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({ never }: any) => noop(never)

        const wrapper = wrapperInitializer.getPageWrapper()

        const getStaticProps = wrapper.wrapGetStaticProps()

        expect((wrapper.wrapPage(PageComponent) as EggsConfig).__eggs).toEqual([])
        expect(await getStaticProps({} as any)).toEqual({ props: { __eggsState: {} } })
      })
    })

    describe('Get Server-side Props', () => {
      test('Mixed `ServerSidePropsFn` without types for `GSSP`', async () => {
        const PageComponent: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ num }) => {
          const res: NotAny<typeof num, number> = num
          return noop(res)
        }

        const wrapper = wrapperInitializer.getPageWrapper()

        const getServerSideProps = wrapper.wrapGetServerSideProps(
          store => async (context: GetServerSidePropsContext<{ code?: string }>) => {
            if (context.params?.code === '404') {
              return {
                notFound: true,
              }
            }

            if (context.resolvedUrl === '/test-url') {
              return {
                redirect: {
                  permanent: true,
                  destination: '/',
                },
              }
            }

            store.dispatch({
              type: 'ANY_ACTION',
              payload: {
                defaultLocale: context.defaultLocale,
              },
            })

            return {
              props: {
                num: 123,
              },
            }
          },
        )

        expect((wrapper.wrapPage(PageComponent) as EggsConfig).__eggs).toEqual([])
        expect(await getServerSideProps({} as any)).toEqual({ props: { __eggsState: {}, num: 123 } })
      })

      test('Mixed `ServerSidePropsFn` with types for `GSSP`', async () => {
        const PageComponent: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ num }) => {
          const res: NotAny<typeof num, number> = num
          return noop(res)
        }

        const wrapper = wrapperInitializer.getPageWrapper()

        const getServerSideProps: GetServerSideProps<Props, { code?: string }> = wrapper.wrapGetServerSideProps(
          () => async context => {
            if (context.params?.code === '404') {
              return {
                notFound: true,
              }
            }

            if (context.resolvedUrl === '/test-url') {
              return {
                redirect: {
                  permanent: true,
                  destination: '/',
                },
              }
            }

            return {
              props: {
                num: 123,
              },
            }
          },
        )

        expect((wrapper.wrapPage(PageComponent) as EggsConfig).__eggs).toEqual([])
        expect(await getServerSideProps({} as any)).toEqual({ props: { __eggsState: {}, num: 123 } })
      })

      test('Empty props in `ServerSidePropsFn`', async () => {
        const PageComponent: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ never }: any) => {
          return noop(never)
        }

        const wrapper = wrapperInitializer.getPageWrapper()

        const getServerSideProps = wrapper.wrapGetServerSideProps(() => async context => {
          if (context.resolvedUrl === '/test-url') {
            return {
              redirect: {
                permanent: true,
                destination: '/',
              },
            }
          }

          return {
            props: {},
          }
        })

        expect((wrapper.wrapPage(PageComponent) as EggsConfig).__eggs).toEqual([])
        expect(await getServerSideProps({} as any)).toEqual({ props: { __eggsState: {} } })
      })

      test('Object as `ServerSidePropsFn` without types for `GSSP`', async () => {
        const PageComponent: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ num }) => {
          const res: NotAny<typeof num, number> = num
          return noop(res)
        }

        const wrapper = wrapperInitializer.getPageWrapper()

        const getServerSideProps = wrapper.wrapGetServerSideProps({ num: 123 })

        expect((wrapper.wrapPage(PageComponent) as EggsConfig).__eggs).toEqual([])
        expect(await getServerSideProps({} as any)).toEqual({ props: { __eggsState: {}, num: 123 } })
      })

      test('Object as `ServerSidePropsFn` with types for `GSSP`', async () => {
        const PageComponent: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ num }) => {
          const res: NotAny<typeof num, number> = num
          return noop(res)
        }

        const wrapper = wrapperInitializer.getPageWrapper()

        const getServerSideProps: GetServerSideProps<Props> = wrapper.wrapGetServerSideProps({ num: 123 })

        expect((wrapper.wrapPage(PageComponent) as EggsConfig).__eggs).toEqual([])
        expect(await getServerSideProps({} as any)).toEqual({ props: { __eggsState: {}, num: 123 } })
      })

      test('Empty object as `ServerSidePropsFn`', async () => {
        const PageComponent: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ never }: any) => {
          return noop(never)
        }

        const wrapper = wrapperInitializer.getPageWrapper()

        const getServerSideProps = wrapper.wrapGetServerSideProps({})

        expect((wrapper.wrapPage(PageComponent) as EggsConfig).__eggs).toEqual([])
        expect(await getServerSideProps({} as any)).toEqual({ props: { __eggsState: {} } })
      })

      test('Without `ServerSidePropsFn`', async () => {
        const PageComponent: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ never }: any) => {
          return noop(never)
        }

        const wrapper = wrapperInitializer.getPageWrapper()

        const getServerSideProps = wrapper.wrapGetServerSideProps()

        expect((wrapper.wrapPage(PageComponent) as EggsConfig).__eggs).toEqual([])
        expect(await getServerSideProps({} as any)).toEqual({ props: { __eggsState: {} } })
      })
    })

    describe('Get Initial App Props', () => {
      test('`InitialAppPropsFn` with `GIP` and not empty props', async () => {
        const CustomApp: AppType = () => null

        const wrapper = wrapperInitializer.getAppWrapper()

        CustomApp.getInitialProps = wrapper.wrapGetInitialProps(store => async () => {
          const appProps: AppInitialProps = { pageProps: {} }

          store.dispatch({ type: 'ANY_ACTION' })

          appProps.pageProps = {
            ...appProps.pageProps,
            num: 123,
          }

          return appProps
        })

        const Page: NextPage & EggsConfig = () => null
        Page.__eggs = []

        const result = await CustomApp.getInitialProps({ Component: Page, ctx: {} } as any)

        expect(result).toEqual({ pageProps: { num: 123, __eggsState: {} } })
      })
    })

    describe('Get Initial Page Props', () => {
      test('`InitialPagePropsFn` with `GIP` and not empty props', async () => {
        const PageComponent: NextPage<Props> = ({ num }) => {
          const res: NotAny<typeof num, number> = num
          return noop(res)
        }

        const wrapper = wrapperInitializer.getPageWrapper()

        const getInitialProps = wrapper.wrapGetInitialProps(store => ctx => {
          store.dispatch({
            type: 'ANY_ACTION',
            payload: {
              defaultLocale: ctx.defaultLocale,
            },
          })

          return {
            num: 123,
          }
        })

        PageComponent.getInitialProps = getInitialProps

        expect(await getInitialProps({} as any)).toEqual({ num: 123, __eggsState: {} })
      })

      test('`InitialPagePropsFn` with `GIP` and empty props', async () => {
        const PageComponent: NextPage = ({ never }: any) => noop(never)

        const wrapper = wrapperInitializer.getPageWrapper()

        const getInitialProps = wrapper.wrapGetInitialProps(store => ctx => {
          store.dispatch({
            type: 'ANY_ACTION',
            payload: {
              defaultLocale: ctx.defaultLocale,
            },
          })

          return {}
        })

        PageComponent.getInitialProps = getInitialProps

        expect(await getInitialProps({} as any)).toEqual({ __eggsState: {} })
      })

      test('Not empty Object as `InitialPagePropsFn`', async () => {
        const PageComponent: NextPage<Props> = ({ num }) => {
          const res: NotAny<typeof num, number> = num
          return noop(res)
        }

        const wrapper = wrapperInitializer.getPageWrapper()

        const getInitialProps = wrapper.wrapGetInitialProps({ num: 123 })

        PageComponent.getInitialProps = getInitialProps

        expect(await getInitialProps({} as any)).toEqual({ num: 123, __eggsState: {} })
      })

      test('Without `InitialPagePropsFn`', async () => {
        const PageComponent: NextPage = ({ never }: any) => noop(never)

        const wrapper = wrapperInitializer.getPageWrapper()

        const getInitialProps = wrapper.wrapGetInitialProps()

        PageComponent.getInitialProps = getInitialProps

        expect(await getInitialProps({} as any)).toEqual({ __eggsState: {} })
      })
    })
  })
})
