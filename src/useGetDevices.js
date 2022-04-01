// hook that access the iFixit API to get a collection of Devices
// GETS devices from {offset} to {offset + limit}
// limit is the number of devices we fetch at one time

import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'

function useGetDevices(offset, limit, query) {
  const [loading, setLoading] = useState(true)
  const [devices, setDevices] = useState([])
  const [hasError, setHasError] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const CancelToken = axios.CancelToken;
  let cancel;

  const filterDevices = (fetchedDevices) => {
    // now that we have fetched devices, we need to make sure we are only displaying leaf nodes (no children)
    // then, for each device we need to check if it has children
    fetchedDevices.map((currentDevice) => {
      // since the search GET gets users and guides, we need to make sure we are only getting devices
      if ((currentDevice.namespace === 'CATEGORY') && (currentDevice.dataType === 'wiki')) {
        // get the children of the current device
        axios.get(`https://www.ifixit.com/api/2.0/wikis/CATEGORY/${currentDevice.title}/children`).then(res => {
          // if the length of the returned array is 0, the device has no children
          // thus, it is a leaf node and we should show it
          if (res.data.length === 0) {
            setDevices(prevDevices => {
              return [...prevDevices, currentDevice]
            })
          }
        }).catch(e => {
          setHasError(true)
        })
      }
    })
  }

  // every time the input text box is changed, remove the already loaded devices
  useEffect(() => {
    setDevices([])
  }, [query])

  // everytime the offset of the input text is changed, we need to fetch new devices
  useEffect(() => {
    // set loading to true because we have started loading new devices
    setLoading(true)
    // clear the error because...well we haven't started loading yet!
    setHasError(false)

    // if query is blank, we are fetching more from all devices
    if (query === '') {
      // first we fetch a "limit"'s worth of devices
      axios.get(`https://www.ifixit.com/api/2.0/wikis/CATEGORY?offset=${offset}&limit=${limit}`).then(res => {
        // we just fetched new devices, so set our fetchedDevices variable
        filterDevices(res.data)

        // res.data.length is the number of devices we loaded, so if we loaded less than what we attempted to,
          // we have reached the end
        // res.data.length cannot be greater than limit
        setHasMore(res.data.length === limit)

        // now, since we are done loading, we can set this to false
        setLoading(false)
      }).catch(e => {
        // we encountered an error - so set the error
        setHasError(true)
      })
    } else {
      // otherwise, we need to pull from our search
      axios.get(`https://www.ifixit.com/api/2.0/search/${query}?offset=${offset}&limit=${limit}`, {
        // we are setting up a cancel token so that if we change the input in the search box while fetching more devices,
          // we can cancel the old now out of date fetch
        cancelToken: new CancelToken(function executor(c) {
          cancel = c;
        })
      }).then(res => {
        // once we get all of the devices, we need to make sure we are only displaying the leaf nodes
        filterDevices(res.data.results)

        // res.data.length is the number of devices we loaded, so if we loaded less than what we attempted to,
          // we have reached the end
        // res.data.length cannot be greater than limit
        setHasMore(res.data.length === limit)

        // now, since we are done loading, we can set this to false
        setLoading(false)
      }).catch(e => {
        // we want to cancel if the effect is called while running itself (changed input text before devices could be loaded)
        if (axios.isCancel(e)) return

        // if we have a different error, setError!
        setHasError(true)
      })
      return () => cancel()
    }

  }, [offset, query])

  return { loading, devices, hasMore, hasError }
}

useGetDevices.defaultProps = { query: '' }

useGetDevices.propTypes = {
  offset: PropTypes.string.isRequired,
  limit: PropTypes.number.isRequired
}

export default useGetDevices