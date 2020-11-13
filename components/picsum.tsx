import { FC } from 'react'
import { useSelector } from 'react-redux'

import { errorSelector, isPicsLoading, picsSelector } from '@/modules/picsum/selectors'

const Picsum: FC = () => {
  const isLoading = useSelector(isPicsLoading)
  const pics = useSelector(picsSelector)
  const error = useSelector(errorSelector)

  if (isLoading) {
    return <div>Load pics ...</div>
  }

  return (
    <div>
      {pics && (
        <pre>
          <code>{JSON.stringify(pics, null, 2)}</code>
        </pre>
      )}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </div>
  )
}

export { Picsum }
