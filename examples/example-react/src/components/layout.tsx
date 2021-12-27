import type { FC } from 'react'
import { Link, Outlet } from 'react-router-dom'

import { Xkcd } from './xkcd'

export const Layout: FC = () => {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to='/'>Home</Link>
          </li>
          <li>
            <Link to='/chuck-norris'>Chuck Norris</Link>
          </li>
          <li>
            <Link to='/dog'>Dog</Link>
          </li>
        </ul>
      </nav>

      <hr />

      <Outlet />

      <hr />

      <Xkcd />
    </div>
  )
}
