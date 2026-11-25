import { useCallback, useEffect, useState } from 'react'
import { api } from '../api/resources'

// Loads a whole list, or one record when `id` is given. Remount (via key) when name or id changes.
export function useResource(name, id) {
  const [state, setState] = useState({ data: null, error: null, loading: true })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let active = true
    const load = id ? api[name].get(id) : api[name].list()
    load
      .then((data) => active && setState({ data, error: null, loading: false }))
      .catch((error) => active && setState({ data: null, error, loading: false }))
    return () => {
      active = false
    }
  }, [name, id, attempt])

  const reload = useCallback(() => {
    setState((s) => ({ ...s, error: null, loading: true }))
    setAttempt((n) => n + 1)
  }, [])

  return { ...state, reload }
}
