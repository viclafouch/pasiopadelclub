import * as React from 'react'

function getStrictContext<T>(
  name?: string
): readonly [
  ({
    value,
    children
  }: {
    value: T
    children?: React.ReactNode
  }) => React.JSX.Element,
  () => T
] {
  const Context = React.createContext<T | undefined>(undefined)

  const Provider = ({
    value,
    children
  }: {
    value: T
    children?: React.ReactNode
  }) => {
    return <Context.Provider value={value}>{children}</Context.Provider>
  }

  const useSafeContext = () => {
    const context = React.useContext(Context)

    if (context === undefined) {
      throw new Error(`useContext must be used within ${name ?? 'a Provider'}`)
    }

    return context
  }

  return [Provider, useSafeContext] as const
}

export { getStrictContext }
