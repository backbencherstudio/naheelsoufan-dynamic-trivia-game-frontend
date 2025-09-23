"use client"
import vectorImg from '@/public/image/vectore.svg'
import Image from 'next/image'
import { useState } from 'react'
import AddQuestionModal from './AddQuestionModal'
function DashboardBanner({userinfo, lang, dict}: {userinfo: string, lang: string, dict: any}) {
      const [isOpen, setIsOpen] = useState(false)
  return (
    <div className='bg-whiteColor my-10 rounded-2xl '>
      <div className=' rounded-2xl px-10 py-8 bg-primaryColor/10'>
          <div className='flex justify-between items-center'>
             <div>
               <h4 className='text-xl lg:text-2xl font-semibold text-primaryColor '>
                {dict?.welcome_back}
               </h4>
               <h4 className='text-xl lg:text-2xl font-semibold text-primaryColor '>
               {userinfo}
               </h4>
               <p className='text-sm text-headerColor mt-3'>
                {dict?.if_you_are_going_to_use_a_passage_of_lorem_ipsum_you_need_to_be_sure_there_isn_t_anything}
               </p>
               <button onClick={() => setIsOpen(true)} className='text-sm cursor-pointer text-white px-3 py-1 rounded-lg bg-primaryColor mt-4'>
                {dict?.add_questions}
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
