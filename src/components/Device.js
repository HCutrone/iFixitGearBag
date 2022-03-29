import React, { useState, useCallback } from 'react'

const Device = ( { device, inDeviceGrid } ) => {
  // the device component will display the images of each device as well as the title
  // then, when the mouse hovers over it will display the summary
  //TODO signify when device is in the gear bag
  //TODO remove signal when device dragged out of bag

  const [nameTextStyle, setNameStyle] = useState({display: 'block', overflow: 'hidden', textOverflow: 'ellipsis'})
  const [summaryTextStyle, setSummaryStyle] = useState({display: 'none'})

  const onDeviceDragStart = (event, deviceName) => {
    event.dataTransfer.setData("newDevice", deviceName)
  }

  const onBagDragStart = (event, deviceName) => {
    event.dataTransfer.setData("bagDevice", deviceName)
  }

  // return one div with the background image as the device image, and two <p>s
  // that contain the name and summary info. It shows the name by default, then
  // hovering over the div shows the summary info
  // linear-gradient(rgba(255,255,255,0.5), rgba(255,255,255,0.5)), 
  // background: `url(${device.image.standard}) noRepeat 0 0`

  return (
    <div className='deviceStyle' style={{  backgroundImage: `url(${device.image.standard})`  }} draggable='true' onDragStart={(event) => (inDeviceGrid) ? onDeviceDragStart(event, `${device.title}`) : onBagDragStart(event, `${device.title}`)}
      // when mouse hovers over the device, hide the title and show the description
      onMouseEnter = {e => {
        setNameStyle({display: 'none'})
        setSummaryStyle({display: 'block', overflowWrap: 'anywhere', overflow: 'hidden', textOverflow: 'ellipsis'})
      }}
      // when mouse stops hovering over the device, hide the summary and show the title
      onMouseLeave = {e => {
        setNameStyle({display: 'block', overflow: 'hidden', textOverflow: 'ellipsis'})
        setSummaryStyle({display: 'none'})
      }}> 
      <p style={nameTextStyle}><span>{device.title}</span></p>
      <p style={summaryTextStyle}><span>{device.summary}</span></p>
    </div>
  )
}

export default Device