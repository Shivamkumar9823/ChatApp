import React from 'react'
import Sidebar from '../../components/Sidebar'
import Msgcontainer from '../../components/Msgcontainer'

const HomePage = () => {
  return (
    <div className='flex w-[700px] sm:h-[450px] md:h-[550px] rounded-lg overflow-hidden bg-grey-400 bg-clip-padding backdrop-blur-lg bg-opacity-0'>
      <Sidebar />
      <Msgcontainer />
  </div>
  )
}

export default HomePage
