import Link from 'next/link'
import { useRouter } from 'next/router'
import type { FC } from 'react'

const links = [
  {
    href: '/',
    label: 'Index page',
  },
  {
    href: '/clock',
    label: 'Clock page',
  },
  {
    href: '/count',
    label: 'Count page',
  },
  {
    href: '/users',
    label: 'Users page',
  },
  {
    href: '/users-ids',
    label: 'User IDs page',
  },
  {
    href: '/picsum',
    label: 'Picsum page',
  },
  {
    href: '/xkcd',
    label: 'XKCD page',
  },
  {
    href: '/chuck-norris',
    label: 'Chuck Norris page',
  },
  {
    href: '/fox',
    label: 'Fox page',
  },
  {
    href: '/aviasales',
    label: 'Aviasales',
  },
]

const Navigation: FC = () => {
  const router = useRouter()

  return (
    <nav>
      {links.map(({ href, label }) =>
        router.pathname === href ? (
          <span key={href} style={{ padding: '10px' }}>
            {label}
          </span>
        ) : (
          <Link key={href} href={href}>
            <a style={{ padding: '10px' }}>{label}</a>
          </Link>
        ),
      )}
    </nav>
  )
}

export { Navigation }
