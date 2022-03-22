import React from 'react'

const Device = ( { title, image, summary } ) => {
  // the device component will display the images of each device as well as the title
  // then, when the mouse hovers over it will display the summary
  // finally, it needs to be able to be dragged into the grab bag
    // remove device when dragged into bag
    // replace device when dragged out of bag
  return (
    <div>{title}</div>
  )
}

export default Device