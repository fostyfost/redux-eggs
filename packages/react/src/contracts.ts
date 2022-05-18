import type { ClassAttributes, ComponentClass, ComponentType, FC, PropsWithChildren } from 'react'

export interface InjectorResult {
  Wrapper: FC<PropsWithChildren>
}

// Infers prop type from component C
export type GetProps<C> = C extends ComponentType<infer P>
  ? C extends ComponentClass<P>
    ? ClassAttributes<InstanceType<C>> & P
    : P
  : never

// Applies LibraryManagedAttributes (proper handling of defaultProps and propTypes).
export type GetLibraryManagedProps<C> = JSX.LibraryManagedAttributes<C, GetProps<C>>

export type WithEggsReturnType = <C extends ComponentType<GetProps<C>>>(Component: C) => FC<GetLibraryManagedProps<C>>
