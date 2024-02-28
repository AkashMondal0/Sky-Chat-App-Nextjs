/* eslint-disable react/jsx-no-undef */
'use client'
import { RootState } from '@/redux/store';
import Image from 'next/image'
import { useSelector } from 'react-redux';
import React from 'react';
import dynamic from 'next/dynamic';

const Sidebar = dynamic(() => import('./components/sidebar'), {
  loading: () => <div>Loading...</div>
})

export default function Index() {
  const Profile_Slice = useSelector((state: RootState) => state.Profile_Slice)
  const Conversation_Slice = useSelector((state: RootState) => state.Conversation_Slice)

  return (
    <>
      <div className='md:block hidden w-full'>
        <NoConversation />
      </div>
      <div className='md:hidden block w-full md:w-96'>
        <Sidebar
          ConversationState={Conversation_Slice}
          ProfileState={Profile_Slice} />
      </div>
    </>
  );
}


const NoConversation = () => {
  return <>
    <div className="md:hidden block w-full">

    </div>
    <div className="justify-center items-center hidden md:flex w-full h-screen">
      <div>
        <Image
          src="/logo.png"
          width={200}
          height={200}
          alt="Picture of the author"
          className='mx-auto'
        />
        <div className="text-3xl text-center font-bold">
          Welcome to Chat App
        </div>
      </div>
    </div>
  </>
}
