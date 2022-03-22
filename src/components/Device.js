import React, { useState } from 'react'

const Device = ( { device } ) => {
  // the device component will display the images of each device as well as the title
  // then, when the mouse hovers over it will display the summary
  //TODO finally, it needs to be able to be dragged into the grab bag
  //TODO remove device when dragged into bag
  //TODO replace device when dragged out of bag

  const [nameTextStyle, setNameStyle] = useState({display: 'block'})
  const [summaryTextStyle, setSummaryStyle] = useState({display: 'none'})
  
  const deviceStyle = {
    width: 150,
    height: 100,
    margin: 6,
    padding: 8,
    color: "white",
    border: "1px solid green",
    padding: 8,
    backgroundImage: `url(${device.image.thumbnail}`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  }

  return (
    <div style={deviceStyle}
      onMouseEnter = {e => {
        setNameStyle({display: 'none'})
        setSummaryStyle({display: 'block'})
      }}
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