import { getInjector } from '@redux-eggs/react'
import type { FC } from 'react'
import { useSelector } from 'react-redux'

import { Loading } from '../components/loading'
import { useAppDispatch } from '../store'
import { getDogEgg } from '../store/eggs/dog'
import { loadDog } from '../store/eggs/dog/action-creators'
import { dogSelector, isDogLoading } from '../store/eggs/dog/selectors'

const UpdateButton: FC = () => {
  const dispatch = useAppDispatch()

  return <button onClick={() => dispatch(loadDog())}>Update</button>
}

const Dog: FC = () => {
  const dog = useSelector(dogSelector)

  return (
    <>
      <div>
        <img src={dog} alt='Dog' width={700} height={475} style={{ objectFit: 'contain' }} />
      </div>
      <UpdateButton />
    </>
  )
}

const Content: FC = () => {
  const isLoading = useSelector(isDogLoading)

  return (
    <div>
      <h2>Dog</h2>
      {isLoading ? <Loading /> : <Dog />}
    </div>
  )
}

const DogInjector = getInjector([getDogEgg()])

const DogPage: FC = () => {
  return (
    <DogInjector.Wrapper>
      <Content />
    </DogInjector.Wrapper>
  )
}

export default DogPage
