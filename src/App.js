import React, { useState } from 'react'
import useGetDevices from './useGetDevices'
import DeviceGrid from './components/DeviceGrid.js'
import GearBag from './components/GearBag.js'
import './style.css'

function App() {
  // offset is the index of the next device to be grabbed from the API
  // width is the number of devices we grab each time we call the API
  const [gearBag, setGearBag] = useState((localStorage.getItem("gearBag")) ? [...JSON.parse(localStorage.getItem("gearBag"))] : [])
  // const [gearBag, setGearBag] = useState([])
  const [offset, setOffset] = useState(0)
  const width = 20

  const {
    devices,
    hasMore,
    loading,
    error
  } = useGetDevices(offset, width)

  //TODO: add marker to signify when a dewvice is in the gearbag
  //TODO: make sure that the final row of devices are able to be dragged into bag (might be stuck behind gear bag)
  //TODO: add a search bar?
  //TODO: fix visuals
      // do something with default images?
      // make gear bag look better...however I decide to do that lol
      // add design to rest of website (background, tab icon, menu nav bar, etc)
  //TODO: check functionality on tablet/phone

  return (
    <>
      {/* Header that lets you search for a device */}

      {/* The main element that holds all of the loaded devices */}
      <DeviceGrid setOffset={setOffset} width={width} 
        devices={devices} loading={loading} error={error} hasMore={hasMore}
        gearBag={gearBag} setGearBag={setGearBag} />

      {/* The element for the gear bag at the bottom of the screen, which can be hidden using the button */}
      <GearBag gearBag={gearBag} setGearBag={setGearBag} devices={devices} />
    </>
  );
}

export default App;
