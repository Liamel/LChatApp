'use client';

import ItemList from '@/components/shared/item-list/ItemList';
import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import { Loader2 } from 'lucide-react';
import React from 'react';
import { DMConversation } from './_components/DMConversation';
import CreateGroupDialog from './_components/CreateGroupDialog';
import { GroupConversationItem } from './_components/GroupConversationItem';

type Props = React.PropsWithChildren<Record<string, never>>;

const ConversationsLayout = ({ children }: Props) => {
  const conversations = useQuery(api.conversations.get);

  return (
    <>
      <ItemList title="Conversations" action={<CreateGroupDialog/>}>
        {conversations ? (
          conversations.length === 0 ? (
            <p className="text-center h-full w-full flex items-center justify-center text-sm text-muted-foreground">
              No conversations found
            </p>
          ) : (
            conversations.map(conversation => {
              return conversation.conversation.isGroup ? (
                <GroupConversationItem
                  key={conversation.conversation._id}
                  id={conversation.conversation._id}
                  name={conversation.conversation.name || ''}
                  lastMessageSender={conversation.lastMessage?.sender}
                  lastMessageContent={conversation.lastMessage?.content}
                  unseenCount={conversation.unseenCount}
                />
              ) : (
                <DMConversation
                  key={conversation.conversation._id}
                  id={conversation.conversation._id}
                  imageUrl={conversation.otherMember?.imageUrl || ''}
                  username={conversation.otherMember?.username || ''}
                  email={conversation.otherMember?.email || ''}
                  lastMessageSender={conversation.lastMessage?.sender}
                  lastMessageContent={conversation.lastMessage?.content}
                  unseenCount={conversation.unseenCount}
                />
              );
            })
          )
        ) : (
          <Loader2 className="text-center h-full flex items-center justify-center text-sm  animate-spin" />
        )}
      </ItemList>
      {children}
    </>
  );
};
export default ConversationsLayout;
