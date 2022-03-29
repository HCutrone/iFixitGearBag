// hook that access the iFixit API to get a collection of Devices
// GETS devices from {offset} to {offset + limit}
// limit is the number of devices we can fit in one row on the screen
// returns one row of devices as an array

import { useEffect, useState } from 'react'
import axios from 'axios'

function useGetDevices(offset, limit, query) {
  const [loading, setLoading] = useState(true)
  const [devices, setDevices] = useState([])
  const [error, setError] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const CancelToken = axios.CancelToken;
  let cancel;

  useEffect(() => {
    setDevices([])
  }, [query])

  useEffect(() => {
    setLoading(true)
    setError(false)
    if (query === '') {
      axios.get(`https://www.ifixit.com/api/2.0/wikis/CATEGORY?offset=${offset}&limit=${limit}`).then(res => {
        setDevices(prevDevices => {
          return [...prevDevices, ...res.data]
        })
        setHasMore(res.data.length === limit)
        setLoading(false)
      }).catch(e => {
        setError(true)
      })
    } else {
      axios.get(`https://www.ifixit.com/api/2.0/search/${query}?offset=${offset}&limit=${limit}`, {
        cancelToken: new CancelToken(function executor(c) {
          cancel = c;
        })
      }).then(res => {
        setDevices(prevDevices => {
          return [...prevDevices, ...res.data.results]
        })
        setHasMore(res.data.results.length === limit)
        setLoading(false)
      }).catch(e => {
        if (axios.isCancel(e)) return
        setError(true)
      })
      return () => cancel()
    }
  }, [offset, query])

  return { loading, error, devices, hasMore }
}

useGetDevices.defaultProps = { query: '' }

export default useGetDevices