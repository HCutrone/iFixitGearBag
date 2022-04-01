// Gear Bag component is the entire Gear Bag on the screen, including the flex box for the devices
// Accepts devices dragged from the device grid

import React from 'react'
import PropTypes from 'prop-types'
import Device from './Device.js'

const GearBag = ( { gearBag, setGearBag, devices } ) => {
  const onDragOver = (event) => {
    event.preventDefault()
  }

  // When a device from the device grid is dropped here, add the device to the gear bag
  // Only adds it to the bag if not already in the bag
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
    setGearBag(prevGearBag => ([...prevGearBag, ...newDevice]))
  }

  // scroll the window back to the top of the page
  const scrollToTop = () => {
    window.scrollTo({
      top: 0, 
      behavior: 'smooth'
    });
  }
  

  return (
    <div className='gearBagStyle'
    onDrop={(event) => onDropInBag(event)} onDragOver={(event) => onDragOver(event)}>
      <div className='gearBagHeader'>
        <h2>Your Gear:</h2>
        <button onClick={scrollToTop}>Scroll to Top</button>
      </div>
      <div className='gearBagFlex'>
        {gearBag.map((device) => {
          return <div key={device.title}> <Device device={device} inDeviceGrid={false}></Device> </div>
        })}
      </div>
    </div>
  )
}

GearBag.propTypes = {
  gearBag: PropTypes.array.isRequired,
  setGearBag: PropTypes.func.isRequired,
  devices: PropTypes.array.isRequired
}

export default GearBag

