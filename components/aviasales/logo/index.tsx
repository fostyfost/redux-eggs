import Image from 'next/image'
import Link from 'next/link'
import type { FC } from 'react'

const Logo: FC = () => {
  return (
    <Link href='/'>
      <a>
        <Image width={82} height={89} src='/aviasales/logo.svg' alt='Логотип Aviasales, ссылка на главную' priority />
      </a>
    </Link>
  )
}

export { Logo }
