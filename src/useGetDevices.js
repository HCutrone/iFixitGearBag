// hook that access the iFixit API to get a collection of Devices
// GETS devices from {offset} to {offset + limit}
// limit is the number of devices we fetch at one time

import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'

function useGetDevices(offset, limit, query) {
  const [loading, setLoading] = useState(true)
  const [devices, setDevices] = useState([])
  const [error, setError] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const CancelToken = axios.CancelToken;
  let cancel;

  // every time the input text box is changed, remove the already loaded devices
  useEffect(() => {
    setDevices([])
  }, [query])

  // everytime the offset of the input text is changed, we need to fetch new devices
  useEffect(() => {
    setLoading(true)
    setError(false)
    // if query is blank, we are fetching more from all devices
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
      // otherwise, we need to pull from our search
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
        // we want to cancel if the effect is called while running itself (changed input text before devices could be loaded)
        if (axios.isCancel(e)) return
        setError(true)
      })
      return () => cancel()
    }
  }, [offset, query])

  return { loading, error, devices, hasMore }
}

useGetDevices.defaultProps = { query: '' }

useGetDevices.propTypes = {
  offset: PropTypes.string.isRequired,
  limit: PropTypes.number.isRequired
}

export default useGetDevices