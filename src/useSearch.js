import React from 'react'

function useSearch( { query } ) {
  const [loading, setLoading] = useState(true)
  const [devices, setDevices] = useState([])
  const [error, setError] = useState(false)
  const [hasMore, setHasMore] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError(false)
    axios.get(`https://www.ifixit.com/api/2.0/search/${query}?offset=${offset}&limit=${width}`).then(res => {
      setDevices(prevDevices => {
        return [...prevDevices, ...res.data]
      })
      setHasMore(res.data.length === width)
      setLoading(false)
    }).catch(e => {
      setError(true)
    })
  }, [offset, width])

  return { loading, error, devices, hasMore }
}

export default useSearch