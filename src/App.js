import React, { useState, useRef, useCallback } from 'react'
import useGetDevices from './useGetDevices'
// import Device from './componenets/Device.js'

function App() {
  // offset is the index of the next device to be grabbed from the API
  // width is the number of devices we grab each time we call the API
  const [offset, setOffset] = useState(0)
  const [width, setWidth] = useState(5)
  const {
    devices,
    hasMore,
    loading,
    error
  } = useGetDevices(offset, width)

  // observer and IntersectionObservers look for the last loaded device on the page
  //    and change the offset (if there are more devices to load)
  const observer = useRef()
  const lastDeviceElementRef = useCallback(node => {
    if (loading) return
    if (observer.current) observer.current.disconnect()

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setOffset(prevOffset => prevOffset + width)
      }
    })

    if (node) observer.current.observe(node)
  }, [loading, hasMore])

  return (
    <div>
      {devices.map((device, index) => {
        if (devices.length === index + 1) {
          return <div ref={lastDeviceElementRef} key={device.title}> {device.title} </div>
        } else {
          return <div key={device.title}> {device.title} </div>
        }
      })}

      <div>{loading && 'Loading...'}</div>
      <div>{error && 'Error'}</div>
    </div>
  );
}

export default App;
