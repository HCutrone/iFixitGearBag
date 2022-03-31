import React, { useEffect, useState } from 'react'
import useGetDevices from './useGetDevices'
import DeviceGrid from './components/DeviceGrid.js'
import GearBag from './components/GearBag.js'
import './style.css'

function App() {
  // offset is the index of the next device to be grabbed from the API
  // limit is the number of devices we grab each time we call the API
  // query is the current text in the search bar
  const [query, setQuery] = useState('')
  const [gearBag, setGearBag] = useState((localStorage.getItem("gearBag")) ? [...JSON.parse(localStorage.getItem("gearBag"))] : [])
  const [offset, setOffset] = useState(0)
  const limit = 20

  // everytime the gear bag is changed, update our localstorage
  useEffect(() => {
    localStorage.setItem("gearBag", JSON.stringify(gearBag))
  }, [gearBag])

  // helper function to update query when text is typed into search bar
  // also resets offset because we are performing a new search, so we need to get the first devices first
  const handleSearch = (e) => {
    setQuery(e.target.value)
    setOffset(0)
  }

  // uses our API hook to load devices 
  const {
    devices,
    hasMore,
    loading,
    error
  } = useGetDevices(offset, limit, query)

  //TODO: add touch functionality for tablet/phone
  //TODO: adjust search bar to grab correct devices

  return (
    <>
      {/* Header that lets you search for a device */}
      <header>
        <h1>Make you own Gear Bag!</h1>
        <p>Drag devices into your gear bag to add it. Drag devices out of your gear bag to remove it.</p>
        <input type='text' placeholder='Search Devices...' onChange={handleSearch}></input>
      </header>

      {/* The main element that holds all of the loaded devices */}
      <DeviceGrid setOffset={setOffset} limit={limit} 
        devices={devices} loading={loading} error={error} hasMore={hasMore}
        gearBag={gearBag} setGearBag={setGearBag} />

      {/* The element for the gear bag at the bottom of the screen */}
      <GearBag gearBag={gearBag} setGearBag={setGearBag} devices={devices} />

      {/* A footer element to tell user they loaded all of the devices! (Also pushes up the last row
          of devices so that they can be dragged and are not blocked by the gear bag) */}
      <footer>
        {!loading && <p>No more devices!</p>}
      </footer>
    </>
  );
}

export default App;