'use client';

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useConversation } from "@/hooks/useConversation";
import { useMutationState } from "@/hooks/useMutationState";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import '@livekit/components-styles';

type Props = {
    callType: 'audio' | 'video' | null;
    video: boolean;
    audio: boolean;
    handleDisconnect: () => void;
    setCallType: React.Dispatch<React.SetStateAction<'audio' | 'video' | null>>;
}

const CallRoom = ({ video, audio, handleDisconnect}: Props) => {
    const {user} = useUser();
    const {conversationId} = useConversation();
    const [token, setToken] =  useState('')
    const {mutate: createMeassage,} = useMutationState(api.message.create)


    useEffect(() => {
        if(user?.username) return;
        (async () => {
            try {
                const res = await fetch(`/api/livekit?room=${conversationId}&username=${user?.fullName}`)
                const data = await res.json();
                console.log(data.token)
                console.log(process.env.NEXT_PUBLIC_LIVEKIT_URL)
                
                if(data.token) setToken(data.token)
                    
                else toast.error('Failed to join call')
            } catch (error) {
                toast.error('Failed to join call')
                console.log(error)
            }
        })()

    }, [conversationId, user?.username, user?.fullName])


    if(token === '') {
        return <div className="w-full h-full flex items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-foreground" />
            <p className="text-sm text-muted-foreground">Joining call...</p>
            <Button variant="destructive" size="icon" onClick={() => handleDisconnect()}>
               Cancel
            </Button>
        </div>
    }
    
    return (
        <div className="w-full h-full">
            <LiveKitRoom data-lk-theme="default" serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL} token={token}
             connect={true} audio={audio} video={video}  onConnected= {() => {
                createMeassage({
                    conversationId,
                    type: 'call',
                    content: ['']
                })
             }}>
                <VideoConference />
            </LiveKitRoom>
        </div>
    )
}

export default CallRoom;