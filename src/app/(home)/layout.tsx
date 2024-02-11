"use client";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Sidebar from "./components/sidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const Profile_Slice = useSelector((state: RootState) => state.Profile_Slice)
  const Conversation_Slice = useSelector((state: RootState) => state.Conversation_Slice)

  return (
    <div>
      <div className="flex w-full">
        <div className='md:block hidden'>
          <Sidebar
            ConversationState={Conversation_Slice}
            ProfileState={Profile_Slice} />
        </div>
        {children}
      </div>
    </div>
  )
}
