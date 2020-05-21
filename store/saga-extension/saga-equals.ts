import { ISagaRegistration, ISagaWithArguments } from './contracts'

export const sagaEquals = (sagaA: ISagaRegistration, sagaB: ISagaRegistration): boolean => {
  if (typeof sagaA === 'function' && typeof sagaB === 'function') {
    return sagaA === sagaB
  }

  if (!sagaA || !sagaB) {
    return sagaA === sagaB
  }

  if (typeof sagaA === 'function') {
    return (
      (sagaA as () => Iterator<any>) === (sagaB as ISagaWithArguments).saga && !(sagaB as ISagaWithArguments).argument
    )
  }

  if (typeof sagaB === 'function') {
    return (
      (sagaA as ISagaWithArguments).saga === (sagaB as () => Iterator<any>) && !(sagaA as ISagaWithArguments).argument
    )
  }

  // TODO: This needs to be a deep equals
  return (
    (sagaA as ISagaWithArguments).saga === (sagaB as ISagaWithArguments).saga &&
    (sagaA as ISagaWithArguments).argument === (sagaB as ISagaWithArguments).argument
  )
}
