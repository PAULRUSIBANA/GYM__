import { useEffect, useRef, useState } from 'react'

// One-shot IntersectionObserver: `seen` flips to true the first time the element scrolls into view.
export function useInView(threshold = 0.15) {
  const ref = useRef(null)
  const [seen, setSeen] = useState(() => typeof IntersectionObserver === 'undefined')

  useEffect(() => {
    const node = ref.current
    if (!node || typeof IntersectionObserver === 'undefined') return undefined
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true)
          observer.disconnect()
        }
      },
      { threshold },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [threshold])

  return [ref, seen]
}
