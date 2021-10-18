import NextLink from 'next/link'
import { useRouter } from 'next/router'
import type { FC, MouseEventHandler } from 'react'
import { useState } from 'react'

import styles from './index.module.scss'

interface Link {
  href: string
  label: string
}

interface NavigationItemProps extends Link {
  isCurrent: boolean
}

interface MenuButtonProps {
  onClick: MouseEventHandler<HTMLButtonElement>
}

interface GroupedLink {
  id: string
  items: Link[]
}

const groupedLinks: GroupedLink[] = [
  {
    id: 'index',
    items: [
      {
        href: '/',
        label: 'Index page (with Get Initial Props)',
      },
      {
        href: '/index-gsp',
        label: 'Index page (with Get Static Props)',
      },
      {
        href: '/index-gssp',
        label: 'Index page (with Get Server-side Props)',
      },
    ],
  },

  {
    id: 'chuck-norris',
    items: [
      {
        href: '/chuck-norris/gip',
        label: 'Chuck Norris page (with Get Initial Props)',
      },
      {
        href: '/chuck-norris/gsp',
        label: 'Chuck Norris page (with Get Static Props)',
      },
      {
        href: '/chuck-norris/gssp',
        label: 'Chuck Norris page (with Get Server-side Props)',
      },
    ],
  },

  {
    id: 'clock',
    items: [
      {
        href: '/clock/gip',
        label: 'Clock page (with Get Initial Props)',
      },
      {
        href: '/clock/gssp',
        label: 'Clock page (with Get Server-side Props)',
      },
    ],
  },

  {
    id: 'count',
    items: [
      {
        href: '/count/gip',
        label: 'Count page (with Get Initial Props)',
      },
      {
        href: '/count/gsp',
        label: 'Count page (with Get Static Props)',
      },
      {
        href: '/count/gssp',
        label: 'Count page (with Get Server-side Props)',
      },
    ],
  },

  {
    id: 'dog',
    items: [
      {
        href: '/dog/gip',
        label: 'Dog page (with Get Initial Props)',
      },
      {
        href: '/dog/gsp',
        label: 'Dog page (with Get Static Props)',
      },
      {
        href: '/dog/gssp',
        label: 'Dog page (with Get Server-side Props)',
      },
    ],
  },

  {
    id: 'fox',
    items: [
      {
        href: '/fox/gip',
        label: 'Fox page (with Get Initial Props)',
      },
      {
        href: '/fox/gsp',
        label: 'Fox page (with Get Static Props)',
      },
      {
        href: '/fox/gssp',
        label: 'Fox page (with Get Server-side Props)',
      },
    ],
  },

  {
    id: 'picsum',
    items: [
      {
        href: '/picsum/gip',
        label: 'Picsum page (with Get Initial Props)',
      },
      {
        href: '/picsum/gsp',
        label: 'Picsum page (with Get Static Props)',
      },
      {
        href: '/picsum/gssp',
        label: 'Picsum page (with Get Server-side Props)',
      },
    ],
  },

  {
    id: 'users',
    items: [
      {
        href: '/users/gip',
        label: 'Users page (with Get Initial Props)',
      },
      {
        href: '/users/gsp',
        label: 'Users page (with Get Static Props)',
      },
      {
        href: '/users/gssp',
        label: 'Users page (with Get Server-side Props)',
      },
    ],
  },

  {
    id: 'users-ids',
    items: [
      {
        href: '/users-ids/gip',
        label: 'User IDs page (with Get Initial Props)',
      },
      {
        href: '/users-ids/gsp',
        label: 'User IDs page (with Get Static Props)',
      },
      {
        href: '/users-ids/gssp',
        label: 'User IDs page (with Get Server-side Props)',
      },
    ],
  },

  {
    id: 'posts',
    items: [
      {
        href: '/posts/gip',
        label: 'Posts page (with Get Initial Props)',
      },
      {
        href: '/posts/gsp',
        label: 'Posts page (with Get Static Props)',
      },
      {
        href: '/posts/gssp',
        label: 'Posts page (with Get Server-side Props)',
      },
    ],
  },

  {
    id: 'xkcd',
    items: [
      {
        href: '/xkcd/gip',
        label: 'XKCD page (with Get Initial Props)',
      },
      {
        href: '/xkcd/gsp',
        label: 'XKCD page (with Get Static Props)',
      },
      {
        href: '/xkcd/gssp',
        label: 'XKCD page (with Get Server-side Props)',
      },
    ],
  },

  {
    id: 'aviasales',
    items: [
      {
        href: '/aviasales/gip',
        label: 'Aviasales page (with Get Initial Props)',
      },
      {
        href: '/aviasales/gssp',
        label: 'Aviasales page (with Get Server-side Props)',
      },
    ],
  },
]

const MenuButton: FC<MenuButtonProps> = ({ onClick, children }) => {
  return (
    <button type='button' onClick={onClick} className={styles.button}>
      {children}
    </button>
  )
}

const NavigationItem: FC<NavigationItemProps> = ({ href, label, isCurrent }) => {
  if (isCurrent) {
    return (
      <span key={href} className={styles.navItem}>
        {label}
      </span>
    )
  }

  return (
    <NextLink key={href} href={href} prefetch={false}>
      <a className={styles.navItem}>{label}</a>
    </NextLink>
  )
}

const Navigation: FC = () => {
  const router = useRouter()

  const [isOpened, setIsOpened] = useState(false)

  const handleToggleMenu: MouseEventHandler<HTMLButtonElement> = () => {
    setIsOpened(prevState => !prevState)
  }

  return (
    <div>
      <MenuButton onClick={handleToggleMenu}>{isOpened ? 'Close menu' : 'Open menu'}</MenuButton>
      {isOpened ? (
        <nav className={styles.nav}>
          {groupedLinks.map(({ id, items }) => (
            <div key={id} className={styles.navGroup}>
              {items.map(({ href, label }) => (
                <NavigationItem key={href} href={href} label={label} isCurrent={href === router.pathname} />
              ))}
            </div>
          ))}
        </nav>
      ) : null}
    </div>
  )
}

export { Navigation }
