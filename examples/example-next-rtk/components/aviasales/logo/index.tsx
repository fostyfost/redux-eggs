import NextImage from 'next/image'
import Link from 'next/link'
import type { FC } from 'react'

const Logo: FC = () => {
  return (
    <Link href='/'>
      <a>
        <NextImage width={82} height={89} src='/aviasales/logo.svg' alt='Aviasales Logo, go to main page' priority />
      </a>
    </Link>
  )
}

export { Logo }
