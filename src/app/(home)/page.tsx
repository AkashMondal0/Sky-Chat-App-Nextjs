/* eslint-disable react/jsx-no-undef */
'use client'
import { RootState } from '@/redux/store';
import Image from 'next/image'
import { useSelector } from 'react-redux';
import Sidebar from './components/sidebar';

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
    <div className="justify-center items-center hidden md:flex w-full h-[100dvh]">
      <Image
        src="/logo.png"
        width={500}
        height={500}
        alt="Picture of the author"
      />
    </div>
  </>
}
