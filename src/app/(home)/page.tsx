'use client'
import Image from 'next/image'
import Sidebar from './components/sidebar';
export default function Index() {


  return (
    <>
      <div className="flex w-full">
        <div className='md:block hidden'>
          {/* <Sidebar /> */}
        </div>

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
        src="logo.png"
        width={500}
        height={500}
        alt="Picture of the author"
      />
    </div>
  </>
}
