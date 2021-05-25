/**
 * @jest-environment jsdom
 */

;(window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ = jest.fn()

import type { EnhancerOptions } from '@reduxjs/toolkit/dist/devtoolsExtension'
import { compose } from 'redux'

import { createStore } from '@/index'

const spyOnConsoleWarn = jest.spyOn(console, 'warn')
const spyOnConsoleError = jest.spyOn(console, 'error')

describe('Tests for `createStore` with Redux Toolkit (Client-side)', () => {
  afterEach(() => {
    expect(spyOnConsoleWarn).not.toBeCalled()
    expect(spyOnConsoleError).not.toBeCalled()
  })

  afterAll(() => {
    spyOnConsoleWarn.mockRestore()
    spyOnConsoleError.mockRestore()
  })

  test('Store supports devtools options', () => {
    ;(window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__.mockImplementation(() => {
      return compose
    })

    const options: EnhancerOptions = {
      trace: false,
      shouldRecordChanges: false,
      autoPause: true,
      shouldCatchErrors: true,
    }

    createStore({ devTools: options })

    expect((window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__).toBeCalledWith(options)
  })
})
