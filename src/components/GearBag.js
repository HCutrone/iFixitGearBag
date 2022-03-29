import React from 'react'
import Device from './Device.js'

const GearBag = ( { gearBag, setGearBag, devices } ) => {

  const onDragOver = (event) => {
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
    setGearBag([...gearBag, ...newDevice])
  }

  return (
    <div className='gearBagStyle' onDrop={(event) => onDropInBag(event)} onDragOver={(event) => onDragOver(event)}>
      <h2 style={{paddingLeft: 10}}>Your Gear:</h2>
      <div className='gearBagFlex'>
        {gearBag.map((device) => {
          localStorage.setItem("gearBag", JSON.stringify(gearBag))
          return <div key={device.title}> <Device device={device} inDeviceGrid={false}></Device> </div>
        })}
      </div>
    </div>
  )
}

export default GearBag