// The device component will display the images of each device as well as the title
// Then, when the mouse hovers over it will display the summary
// Device componenets can be dragged into and out of the gear bag
import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Device = ( { device, inDeviceGrid } ) => {
  // we can use the State hook to hide/show the names and summaries
  const [nameTextStyle, setNameStyle] = useState({display: 'block', overflow: 'hidden', textOverflow: 'ellipsis'})
  const [summaryTextStyle, setSummaryStyle] = useState({display: 'none'})
  const dragImage = new Image()
  dragImage.src = `${device.image.thumbnail}`

  // onDeviceDragStart - called when a device component located in the device grid is dragged
  // transfers the name of the dragged device to its drop point
  // since some of the summaries overflow out of the device div, we set the drag image to the background image
  // set the offset of the drag image to 150, 112 to make the image easier to see when dragging
  const onDeviceDragStart = (event, deviceName) => {
    event.dataTransfer.setData("newDevice", deviceName)
    event.dataTransfer.setDragImage(dragImage, 150, 112)
  }

  // onBagDragStart - called when a device component located in the gear bag is dragged
  // transfers the name of the dragged device to its drop point
  // since some of the summaries overflow out of the device div, we set the drag image to the background image
  const onBagDragStart = (event, deviceName) => {
    event.dataTransfer.setData("bagDevice", deviceName)
    event.dataTransfer.setDragImage(dragImage, 150, 112)
  }

  // return one div with the background image as the device image, and two <p>s
  // that contain the name and summary info. It shows the name by default, then
  // hovering over the div shows the summary info
  return (
    <div className='deviceStyle' style={{ backgroundImage: `url(${device.image.standard})` }}
    draggable='true'
    onDragStart={(event) => (inDeviceGrid) ? onDeviceDragStart(event, `${device.title}`) : onBagDragStart(event, `${device.title}`)}
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

Device.propTypes = {
  device: PropTypes.object.isRequired,
  inDeviceGrid: PropTypes.bool.isRequired
}

export default Device