import React from 'react'
import EmptyIcon from '../../assets/image/icon/To Do.png'
const NoToDo = () => {
  return (
    <div className='h-full w-full flex justify-center items-center'>
        <img src={EmptyIcon} className="w-1/3 h-1/3 object-contain ..." alt="" />
    </div>
  )
}

export default NoToDo