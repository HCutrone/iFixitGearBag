import React, { useState } from 'react'

const Device = ( { device } ) => {
  // the device component will display the images of each device as well as the title
  // then, when the mouse hovers over it will display the summary
  //TODO signify when device is in the gear bag
  //TODO remove signal when device dragged out of bag

  const [nameTextStyle, setNameStyle] = useState({display: 'block'})
  const [summaryTextStyle, setSummaryStyle] = useState({display: 'none'})
  const [inGearBag, setInGearBag] = useState(false)
  
  // deviceStyle is the CSS to style the div holding the image and text for each device
  const deviceStyle = {
    width: 150,
    height: 100,
    margin: 6,
    padding: 8,
    color: "white",
    textAlign: "center",
    border: "1px solid green",
    padding: 8,
    backgroundImage: `url(${device.image.thumbnail}`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  }

  const onDragStart = (event, deviceName) => {
    event.dataTransfer.setData("newDevice", deviceName)
  }

  // return one div with the background image as the device image, and two <p>s
  // that contain the name and summary info. It shows the name by default, then
  // hovering over the div shows the summary info
  return (
    <div style={deviceStyle} draggable='true' onDragStart={(event, deviceName) => onDragStart(event, `${device.title}`)}
      // when mouse hovers over the device, hide the title and show the description
      onMouseEnter = {e => {
        setNameStyle({display: 'none'})
        setSummaryStyle({display: 'block'})
      }}
      // when mouse stops hovering over the device, hide the summary and show the title
      onMouseLeave = {e => {
        setNameStyle({display: 'block'})
        setSummaryStyle({display: 'none'})
      }}> 
      <p style={nameTextStyle}>{device.title}</p>
      <p style={summaryTextStyle}>{device.summary}</p>
    </div>
  )
}

export default Device