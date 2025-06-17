'use client';

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useConversation } from "@/hooks/useConversation";
import { useQuery } from "convex/react";
import Message from "./Message";
import { useMutationState } from "@/hooks/useMutationState";
import { useEffect, useMemo, useRef } from "react";
import { TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { TooltipTrigger } from "@/components/ui/tooltip";
import { Tooltip } from "@/components/ui/tooltip";


type Props = {
    members: {
        lastSeenMessageId?: Id<"messages"> | undefined;
        username?: string;
        id: Id<"users">;
        imageUrl?: string;
        email?: string;
    }[]
}

export const Body = ({members}: Props) => {
    const { conversationId } = useConversation();
    const lastMarkedMessageRef = useRef<Id<"messages"> | null>(null);

    const messages = useQuery(api.messages.get, {
        id: conversationId as Id<"conversations">,
    });

    const {mutate: markRead} = useMutationState(api.conversation.markRead);

    useEffect(() => {
        if (messages && messages.length > 0) {
            const latestMessage = messages[0];
            // Only mark as read if it's a new message
            if (latestMessage._id !== lastMarkedMessageRef.current) {
                lastMarkedMessageRef.current = latestMessage._id;
                markRead({
                    conversationId: conversationId as Id<"conversations">,
                    messageId: latestMessage._id,
                });
            }
        }
    }, [messages, conversationId, markRead]);

    const getSeenMessage = useMemo(() => (messageId: Id<"messages">) => {
        const seenUsers = members
            .filter(member => member.lastSeenMessageId === messageId)
            .map(member => member.username?.split(' ')[0])
            .filter((name): name is string => Boolean(name));

        if (seenUsers.length === 0) return undefined;
        return formatBySeen(seenUsers);
    }, [members]);

    const formatBySeen = (names: string[]) => {
        switch (names.length) {
            case 1:
                return <p className="text-xs text-right text-gray-200">Seen by {names[0]} </p>;
            case 2:
                return <p className="text-xs text-right text-gray-200">Seen by {names[0]} and {names[1]}</p>;
            default:
                return <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>    
                            <p className="text-xs  text-gray-200 text-right">Seen by {names[0]} and {names.length} others</p>
                        </TooltipTrigger>
                        <TooltipContent>
                            <ul className="list-disc pl-4">
                                {names.map(name => (
                                    <li key={name}>{name}</li>
                                ))}
                            </ul>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>;
        }
    }
    return (
        <div className='flex-1 w-full overflow-y-auto flex flex-col-reverse gap-2 p-3 scrollbar-hide'>
            {messages?.map(({_id, isCurrentUser, senderImage, senderName, content, type, _creationTime}, index) => {
                const lastByUser = messages[index - 1]?.senderId === messages[index]?.senderId;

                const seenMessage = isCurrentUser ? getSeenMessage(_id) : undefined;

                return (
                    <Message
                        key={_id}
                        fromCurrentUser={isCurrentUser}
                        content={content}
                        senderImage={senderImage}
                        senderName={senderName}
                        lastByUser={lastByUser}
                        createdAt={_creationTime}
                        seen={seenMessage}
                        type={type}
                    />
                )
            })}
        </div>
    )
}

export default Body;