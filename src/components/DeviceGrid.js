// The device grid is the FlexBox container for all of the devices loaded from the API
// Handles pagination (calls API for more devices when the last device is on screen)
// Also can accept devices dragged from the Gear Bag

import React, { useRef, useCallback } from 'react'
import PropTypes from 'prop-types'
import Device from './Device.js'

const DeviceGrid = ( { setOffset, limit, devices, loading, hasMore, gearBag, setGearBag } ) => {
  // observer and IntersectionObservers look for the last loaded device on the page
  // and change the offset (if there are more devices to load)
  // Changing the offset activate the 'useGetDevices' useEffect, pulling more devices from the API
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

  // Accepts devices dragged from the Gear Bag
  // Removes the device from the Gear Bag
  // Changing the Gear Bag activate App's GearBag useEffect, which updates the local storage
  const onDropInDevice = (event) => {
    const deviceName = event.dataTransfer.getData("bagDevice")
 
    const newGearBag = gearBag.filter((potDevice) => {
      if (!(potDevice.title === deviceName)) {
        return potDevice
      }
    })

    setGearBag([...newGearBag])
  }


  return (
    <div className='devicesFlex'
    onDrop={(event) => onDropInDevice(event)} onDragOver={(event) => onDeviceDragOver(event)} >
      {devices.map((device, index) => {
        // if we are returning the last device of the load, we are marking it as the last one so that once
        // it is on the screen, we load more devices
        if (devices.length === index + 1) {
          return <div draggable ref={lastDeviceElementRef} key={device.title}> <Device device={device} inDeviceGrid={true}></Device> </div>
        } else {
          return <div draggable key={device.title}> <Device device={device} inDeviceGrid={true}></Device> </div> 
        }
      })}
    </div>
  )
}

DeviceGrid.propTypes = {
  setOffset: PropTypes.func.isRequired,
  limit: PropTypes.number.isRequired,
  devices: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  hasMore: PropTypes.bool.isRequired,
  gearBag: PropTypes.array.isRequired,
  setGearBag: PropTypes.func.isRequired
}

export default DeviceGrid

