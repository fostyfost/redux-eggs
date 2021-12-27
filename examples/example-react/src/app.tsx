import type { FC } from 'react'
import * as React from 'react'
import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'

import { Layout } from './components/layout'
import { Loading } from './components/loading'
import Home from './pages/home'
import NotFoundPage from './pages/not-found'

const ChuckNorrisPage = lazy(() => import('./pages/chuck-norris'))
const DogPage = lazy(() => import('./pages/dog'))

export const App: FC = () => {
  return (
    <div>
      <h1>Redux Eggs Simple Example</h1>

      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />

          <Route
            path='chuck-norris'
            element={
              <Suspense fallback={<Loading />}>
                <ChuckNorrisPage />
              </Suspense>
            }
          />

          <Route
            path='dog'
            element={
              <Suspense fallback={<Loading />}>
                <DogPage />
              </Suspense>
            }
          />

          <Route
            path='*'
            element={
              <Suspense fallback={<Loading />}>
                <NotFoundPage />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </div>
  )
}
