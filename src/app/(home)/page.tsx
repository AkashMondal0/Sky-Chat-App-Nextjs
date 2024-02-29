/* eslint-disable react/jsx-no-undef */
'use client'
import { RootState } from '@/redux/store';
import Image from 'next/image'
import { useSelector } from 'react-redux';
import React from 'react';
import dynamic from 'next/dynamic';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CardContent, CardTitle } from '@/components/ui/card';
import UserNav from './components/user-nav';
import { Button } from '@/components/ui/button';
import { Bell, Paintbrush2Icon } from 'lucide-react';

const Sidebar = dynamic(() => import('./components/sidebar'), {
  loading: () => <HeaderLoading/>
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

const HeaderLoading = () => {
  return <div>
  <div className="col-span-3 border-none">
    <ScrollArea className={`min-h-[100dvh] w-full md:w-96 scroll-smooth border-r`}>
      <div>
        <div className="flex justify-between w-full p-6 items-center">
          <CardTitle>Sky Chat</CardTitle>
          <div className='h-12 w-60' />
        </div>
        <div className='flex justify-between items-center w-full mb-2 px-4'>
          <div className='flex gap-1'>
          </div>
          <div>
            <Button variant={"ghost"} onClick={() => {

            }}>
              <Bell className='w-6 h-6 cursor-pointer' />
            </Button>
            <Button variant={"ghost"}>
              <Paintbrush2Icon className='w-6 h-6 cursor-pointer' />
            </Button>
          </div>
        </div>
      </div>
    </ScrollArea>
  </div>
</div>
}