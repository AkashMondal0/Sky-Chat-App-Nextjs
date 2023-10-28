'use client'
import { redirect, useSearchParams } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useEffect, useState } from "react";
import socket from "@/lib/socket";
import useClientProfile from "@/hooks/client-profile";
import { MessageDirect } from "@/interface/type";
import Sidebar from "@/app/(home)/components/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import Header from "./components/header";
import ChatBody from "./components/body";
import ChatFooter from "./components/footer";
import useScrollToTop from "@/hooks/scrollToBottom";


export default function Index() {
  const profile = useUser()
  const currentProfile = useClientProfile()
  const searchParam = useSearchParams().get("id")
  const scrollIntoView = useScrollToTop()

  let conversation = currentProfile.conversations.find((conversation) => conversation.id === searchParam)


  useEffect(() => {
    if (profile.user) {
      console.log('socket', socket.connected)
      socket.emit('user_connect', {
        id: profile.user?.sid
      })
      currentProfile.setState({
        ...currentProfile.state,
        id: profile.user?.sid as string,
        name: profile.user?.name as string,
        imageUrl: profile.user?.picture as string,
        userId: profile.user?.sid as string,
      })
    }
    if (!profile) {
      return redirect("/auth")
    }
  }, [profile])

  useEffect(() => {
    socket.on('message_for_user', (data: MessageDirect) => {
      currentProfile.updateConversation(data)
      if (data.conversationId === searchParam) {
        scrollIntoView.setState()
      }
    })
    return () => {
      socket.off('message_for_user')
    }
  }, [socket, searchParam])

  return (
    <div className="flex w-full">
      <div className='md:block hidden'>
        <Sidebar />
      </div>
      {!conversation ? null :
        <ScrollArea className="h-screen w-full rounded-md border scroll-smooth">
          <Header data={conversation} />
          <ChatBody data={conversation} />
          <ChatFooter data={conversation} />
        </ScrollArea>}
    </div>
  );
}