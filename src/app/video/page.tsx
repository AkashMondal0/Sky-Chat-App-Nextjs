"use client"

import { Button } from '@/components/ui/button';
import { socket } from '@/lib/socket';
import React, { useEffect, useState } from 'react'

const VideoCall = () => {
  const [socketData, setSocketData] = useState<any>(null);

  useEffect(() => {
    socket.on('callUser', (data) => {
      console.log('callUser', data)
    });
    setSocketData(socket);
  }, [])

  const startCall = () => {
    socket.emit('callUser', {
      email: socketData?.id,
      room: 'room'
    })
  }


  return (
    <div className=''>
      <h1>  {socketData?.id}</h1>

      <Button variant={"default"} onClick={startCall}>
        Start Call
      </Button>
      <Button variant={"default"}>
        Answer Call
      </Button>
    </div>
  )
}

export default VideoCall