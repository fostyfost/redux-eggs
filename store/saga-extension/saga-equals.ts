import { SagaRegistration, SagaWithArguments } from './contracts'

export const sagaEquals = (sagaA: SagaRegistration, sagaB: SagaRegistration): boolean => {
  if (typeof sagaA === 'function' && typeof sagaB === 'function') {
    return sagaA === sagaB
  }

  if (!sagaA || !sagaB) {
    return sagaA === sagaB
  }

  if (typeof sagaA === 'function') {
    return (
      (sagaA as () => Iterator<any>) === (sagaB as SagaWithArguments).saga && !(sagaB as SagaWithArguments).argument
    )
  }

  if (typeof sagaB === 'function') {
    return (
      (sagaA as SagaWithArguments).saga === (sagaB as () => Iterator<any>) && !(sagaA as SagaWithArguments).argument
    )
  }

  // TODO: This needs to be a deep equals
  return (
    (sagaA as SagaWithArguments).saga === (sagaB as SagaWithArguments).saga &&
    (sagaA as SagaWithArguments).argument === (sagaB as SagaWithArguments).argument
  )
}
