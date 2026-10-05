import * as React from "react"

/**
 * Returns a stable function that runs `callback` once calls have stopped for
 * `delay` ms. Always calls the latest `callback`. Pending calls are dropped on
 * unmount; `cancel()` drops them manually.
 */
export function useDebouncedCallback<Args extends unknown[]>(
  callback: (...args: Args) => void,
  delay: number
) {
  const callbackRef = React.useRef(callback)
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  React.useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  const cancel = React.useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  React.useEffect(() => cancel, [cancel])

  const debounced = React.useCallback(
    (...args: Args) => {
      cancel()
      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null
        callbackRef.current(...args)
      }, delay)
    },
    [cancel, delay]
  )

  return React.useMemo(() => Object.assign(debounced, { cancel }), [debounced, cancel])
}
