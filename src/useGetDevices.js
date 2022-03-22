// hook that access the iFixit API to get a collection of Devices
// GETS devices from {offset} to {offset + width}
// width is the number of devices we can fit in one row on the screen
// returns one row of devices as an array

import { useEffect, useState } from 'react'
import axios from 'axios'

export default function useGetDevices(offset, width) {
  const [loading, setLoading] = useState(true)
  const [devices, setDevices] = useState([])
  const [error, setError] = useState(false)
  const [hasMore, setHasMore] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError(false)
    axios.get(`https://www.ifixit.com/api/2.0/wikis/CATEGORY?offset=${offset}&limit=${width}`).then(res => {
      setDevices(prevDevices => {
        return [...prevDevices, ...res.data]
      })
      setHasMore(res.data.length > 0)
      setLoading(false)
    }).catch(e => {
      setError(true)
    })
  }, [offset, width])

  return { loading, error, devices, hasMore }
}
