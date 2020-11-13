import { FC, useEffect, useRef } from 'react'

interface AddedModulesCleanupProps {
  cleanup: () => void
}

/**
 * This component is rendered as the last child of `DynamicModuleLoader`
 * so react runs willUnmount on connected(react-redux) children before this
 * cleanup and allows them to unsubscribe from store before dynamic reducers
 * removing (and avoid errors in selectors)
 */
const AddedModulesCleanup: FC<AddedModulesCleanupProps> = ({ cleanup }) => {
  const callbackRef = useRef(cleanup)

  useEffect(() => {
    if (callbackRef.current !== cleanup) {
      callbackRef.current = cleanup
    }
  }, [cleanup])

  useEffect(() => {
    return (): void => {
      if (callbackRef.current) {
        callbackRef.current()
      }
    }
  }, [])

  return null
}

export { AddedModulesCleanup }
