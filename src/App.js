import React, { useState } from 'react'
import useGetDevices from './useGetDevices'
import DeviceGrid from './components/DeviceGrid.js'
import GearBag from './components/GearBag.js'
import './style.css'

function App() {
  // offset is the index of the next device to be grabbed from the API
  // limit is the number of devices we grab each time we call the API
  const [query, setQuery] = useState('')
  const [gearBag, setGearBag] = useState((localStorage.getItem("gearBag")) ? [...JSON.parse(localStorage.getItem("gearBag"))] : [])
  // const [gearBag, setGearBag] = useState([])
  const [offset, setOffset] = useState(0)
  const [limit, setLimit] = useState(20)

  function handleSearch(e) {
    setQuery(e.target.value)
    setOffset(0)
  }

  const {
    devices,
    hasMore,
    loading,
    error
  } = useGetDevices(offset, limit, query)

  //TODO: add touch functionality for tablet/phone
  //TODO: add marker to signify when a dewvice is in the gearbag
  //TODO: adjust search bar to grab correct devices

  return (
    <>
      {/* Header that lets you search for a device */}
      <header>
        <h1>Make you own Gear Bag!</h1>
        <p>Drag devices into your gear bag to add it. Drag devices out of your gear bag to remove it.</p>
      </header>

      <input type='text' placeholder='Search Devices...' onChange={handleSearch}></input>

      {/* The main element that holds all of the loaded devices */}
      <DeviceGrid setOffset={setOffset} limit={limit} 
        devices={devices} loading={loading} error={error} hasMore={hasMore}
        gearBag={gearBag} setGearBag={setGearBag} />

      {/* The element for the gear bag at the bottom of the screen, which can be hidden using the button */}
      <GearBag gearBag={gearBag} setGearBag={setGearBag} devices={devices} />

      <footer className='footer'>
        <p>No more devices!</p>
      </footer>
    </>
  );
}

export default App;
