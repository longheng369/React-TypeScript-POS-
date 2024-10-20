import React from 'react'
interface CardInterface {
   product_name: string;
   image_url?: string;
}

const Card : React.FC<CardInterface> = ({product_name, image_url}) => {
  return (
   <div className='flex flex-col shadow-md rounded-[0.4rem] overflow-hidden border border-gray-200'>
      <div className='w-full bg-red-400'>
         {image_url ? <img src={image_url} alt="Thumbnail" className='w-full h-auto' /> : <img src='https://via.placeholder.com/400x400' />}
      </div>
      <div className='text-wrap overflow-hidden text-ellipsis whitespace-normal p-2'>
         {product_name}
      </div>
   </div>
  )
}

export default Card