import React, { useState, useRef, useCallback } from 'react'
import useGetDevices from './useGetDevices'
import Device from './components/Device.js'
import GearBagDevice from './components/GearBagDevice.js'
import './style.css'
import { render } from '@testing-library/react'

// using a flexbox to display the devices in rows that automatically wrap
const devicesFlex = {
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "center",
  padding: 30
}

// using a flexbox to display the devices in rows that automatically wrap
const gearBagFlex = {
  display: "flex",
  flexDirection: "row",
  flexWrap: "no-wrap",
  justifyContent: "left",
  alignItems: "center",
  overflowX: 'auto',
  paddingLeft: 20
}

// gearBagStyle is the CSS to style the div holding the images and text for saved devices
const gearBagStyle = {
  width: '100vw',
  height: 200,
  background: 'rgb(0, 112, 255, 0.5)',
  position: 'fixed',
  bottom: 0,
}

function App() {
  // offset is the index of the next device to be grabbed from the API
  // width is the number of devices we grab each time we call the API
  const [offset, setOffset] = useState(0)
  const [width, setWidth] = useState(20)
  const [gearBag, setGearBag] = useState((localStorage.getItem("gearBag")) ? [...JSON.parse(localStorage.getItem("gearBag"))] : [])
  // const [gearBag, setGearBag] = useState([])
  const {
    devices,
    hasMore,
    loading,
    error
  } = useGetDevices(offset, width)

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
        setOffset(prevOffset => prevOffset + width)
      }
    })

    if (node) {
      observer.current.observe(node)
    }
  }, [loading, hasMore])

  const onDragOver = (event) => {
    event.preventDefault()
  }

  const onDeviceDragOver = (event) => {
    event.preventDefault()
  }

  const onDropInBag = (event) => {
    // get the name of the device we are dragging into the gear bag
    const deviceName = event.dataTransfer.getData("newDevice")

    // get the actual device by iterating through the full device array and finding the
    // device with the matching name
    var newDevice = []
    devices.map((potDevice) => {
      if (potDevice.title === deviceName) {
        newDevice = [potDevice]
        return
      }
    });

    // in order to make sure we do not add duplicates, iterate through the current gear bag
    // and if the new deivce is already in the gear bag, do not add it
    gearBag.map((device) => {
      if (device.title === deviceName) {
        newDevice = []
        return
      }
    })

    // setting the gearbag to include the previous devices and the new (dragged) device
    // making the array a Set, then returning the Set spread out in an array to eliminate duplicates
    setGearBag([...gearBag, ...newDevice])
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

  //TODO: add a search bar?
  //TODO: fix visuals
      // do something with default images?
      // make device names more readable
      // make device summaries fit in box (and more readable)
      // make gear bag look better...however I decide to do that lol
      // add design to rest of website (background, tab icon, menu nav bar, etc)

  return (
    <>
      {/* The main div that holds all of the loaded devices */}
      <div style={devicesFlex} onDrop={(event) => onDropInDevice(event)} onDragOver={(event) => onDeviceDragOver(event)}>
        {devices.map((device, index) => {
          // if we are returning the last device of the load, we are marking it as the last one so that once
          // it is on the screen, we load more devices
          if (devices.length === index + 1) {
            return <div ref={lastDeviceElementRef} key={device.title}> <Device device={device}></Device> </div>
          } else {
            return <div key={device.title}> <Device device={device}></Device> </div>
          }
        })}

        {/* simple divs to signify if we are getting more devices, or if we encountered an error */}
        <div>{loading && 'Loading...'}</div>
        <div>{error && 'Error'}</div>
      </div>

      {/* Here is the div for the gear bag at the bottom of the screen */}
      <div style={gearBagStyle} onDrop={(event) => onDropInBag(event)} onDragOver={(event) => onDragOver(event)}>
        <h3 style={{paddingLeft: 10}}>Your Gear:</h3>
        <div style={gearBagFlex}>
          {gearBag.map((device) => {
            localStorage.setItem("gearBag", JSON.stringify(gearBag))
            return <div key={device.title}> <GearBagDevice device={device}></GearBagDevice> </div>
          })}
        </div>
      </div>
    </>
  );
}

export default App;
