import { useEffect, useMemo, useState } from 'react'
import { Collection } from '../helpers/Collection'
import { useDebounce } from './helpers/useDebounce'
import { Collection as Collect } from 'collect.js'

let timer = setTimeout(() => {}, 0)

export function useCollection<T>(
  collection: Collection<T>,
  fn?: (collect: Collect<T>) => T[],
  deps: any[] = []
) {
  const [lastUpdate, setLastUpdate] = useState<number>(0)
  const lastUpdateDebounce = useDebounce(lastUpdate, 500)

  const data = useMemo(() => {
    const all = collection.all()

    return fn ? fn(new Collect(all)) : all
  }, [lastUpdateDebounce, ...deps])

  const onForceUpdate = () => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      setLastUpdate(Date.now())
    }, 500)
  }

  useEffect(() => {
    collection.on('forceUpdate', onForceUpdate)
    return () => {
      collection.off('forceUpdate', onForceUpdate)
    }
  }, [])

  return { data }
}
