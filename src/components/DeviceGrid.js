import React, { useRef, useCallback } from 'react'
import Device from './Device.js'

const DeviceGrid = ( { setOffset, limit, devices, loading, error, hasMore, gearBag, setGearBag } ) => {
  // observer and IntersectionObservers look for the last loaded device on the page
  // and change the offset (if there are more devices to load)
  const observer = useRef()
  const lastDeviceElementRef = useCallback(node => {
    if (loading) {
      return
    }

    if (observer.current) {
      observer.current.disconnect()
    }

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setOffset(prevOffset => prevOffset + limit)
      }
    })

    if (node) {
      observer.current.observe(node)
    }
  }, [loading, hasMore])

  const onDeviceDragOver = (event) => {
    event.preventDefault()
  }

  const onDropInDevice = (event) => {
    const deviceName = event.dataTransfer.getData("bagDevice")

    const newGearBag = gearBag.filter((potDevice) => {
      if (!(potDevice.title === deviceName)) {
        return potDevice
      }
    })

    setGearBag([...newGearBag])

    localStorage.clear()
    localStorage.setItem("gearBag", JSON.stringify(newGearBag))
  }

  return (
    <div className='devicesFlex' onDrop={(event) => onDropInDevice(event)} onDragOver={(event) => onDeviceDragOver(event)}>
      {devices.map((device, index) => {
        // if we are returning the last device of the load, we are marking it as the last one so that once
        // it is on the screen, we load more devices
        if (devices.length === index + 1) {
          return <div ref={lastDeviceElementRef} key={device.title}> <Device device={device} inDeviceGrid={true}></Device> </div>
        } else {
          return <div key={device.title}> <Device device={device} inDeviceGrid={true}></Device> </div>
        }
      })}

      {/* simple divs to signify if we are getting more devices, or if we encountered an error */}
      <div>{loading && 'Loading Devices..'}</div>
      <div>{error && 'Error'}</div>
    </div>
  )
}

export default DeviceGrid