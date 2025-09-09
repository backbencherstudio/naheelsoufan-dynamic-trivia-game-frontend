"use client"
import vectorImg from '@/public/image/vectore.svg'
import Image from 'next/image'
import { useState } from 'react'
import AddQuestionModal from './AddQuestionModal'
function DashboardBanner() {
      const [isOpen, setIsOpen] = useState(false)
  return (
    <div className='bg-whiteColor my-10 rounded-2xl '>
      <div className=' rounded-2xl px-10 py-8 bg-primaryColor/10'>
          <div className='flex justify-between items-center'>
             <div>
               <h4 className='text-xl lg:text-2xl font-semibold text-primaryColor '>
                Welcome back!
               </h4>
               <h4 className='text-xl lg:text-2xl font-semibold text-primaryColor '>
               walid_h929
               </h4>
               <p className='text-sm text-headerColor mt-3'>
                If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything
               </p>
               <button onClick={() => setIsOpen(true)} className='text-sm cursor-pointer text-white px-3 py-1 rounded-lg bg-primaryColor mt-4'>
                Add Questions
               </button>
             </div>
             <div>
              <Image src={vectorImg} alt='image' width={380} height={380} className='max-w-[380px]'/>
             </div>
          </div>
          <AddQuestionModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </div>
    </div>
  )
}

export default DashboardBanner
