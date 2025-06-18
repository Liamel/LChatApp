'use client';

import ConversationContainer from '@/components/shared/conversation/ConversationConteiner';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useQuery } from 'convex/react';
import React from 'react';
import { Header } from './_componenets/Header';
import { Loader2 } from 'lucide-react';
import { Body } from './_componenets/body/Body';
import { ChatInput } from './_componenets/input/ChatInput';
import { RemoveFriendDialog } from './_componenets/dialogs/RemoveFriendDialog';
import DeleteGroupDialog from './_componenets/dialogs/DeleteGroupDialog';
import LeaveGroupDialog from './_componenets/dialogs/LeaveGroupDialog';

type Props = {
  params: Promise<{
    conversationId: Id<'conversations'>;
  }>;
};

const ConversationPage = ({ params }: Props) => {
  const { conversationId } = React.use(params);
  const conversation = useQuery(api.conversation.get, {
    id: conversationId as Id<'conversations'>,
  });

  const [removeFriendDialogOpen, setRemoveFriendDialogOpen] = React.useState(false);
  const [deleteGroupDialogOpen, setDeleteGroupDialogOpen] = React.useState(false);
  const [leaveGroupDialogOpen, setLeaveGroupDialogOpen] = React.useState(false);
  const [callType, setCallType] = React.useState<'audio' | 'video' | null>(null);

  return conversation === undefined ? (
    <div className="flex h-full w-full items-center justify-center">
      <Loader2 className="w-10 h-10 animate-spin" />
    </div>
  ) : conversation === null ? (
    <div className="flex h-full w-full items-center justify-center">
      <h1>Conversation not found</h1>
    </div>
  ) : (
    <ConversationContainer>
      <RemoveFriendDialog
        open={removeFriendDialogOpen}
        setOpen={setRemoveFriendDialogOpen}
        conversationId={conversationId}
      />
      <DeleteGroupDialog
        open={deleteGroupDialogOpen}
        setOpen={setDeleteGroupDialogOpen}
        conversationId={conversationId}
      />
      <LeaveGroupDialog
        open={leaveGroupDialogOpen}
        setOpen={setLeaveGroupDialogOpen}
        conversationId={conversationId}
      />
      <Header
        setCallType={setCallType}
        imageUrl={conversation.isGroup ? '' : conversation.otherMember?.imageUrl || ''}
        name={(conversation.isGroup ? conversation.name : conversation.otherMember?.username) || ''}
        options={
          conversation.isGroup
            ? [
                {
                  label: 'Leave Group',
                  destructive: false,
                  onClick: () => setLeaveGroupDialogOpen(true),
                },
                {
                  label: 'Delete Group',
                  destructive: true,
                  onClick: () => setDeleteGroupDialogOpen(true),
                },
              ]
            : [
                {
                  label: 'Remove Friend',
                  destructive: true,
                  onClick: () => setRemoveFriendDialogOpen(true),
                },
              ]
        }
      />
      <Body
        members={
          conversation.isGroup
            ? conversation.otherMembers
              ? conversation.otherMembers.map(member => ({ ...member, id: member._id }))
              : []
            : conversation.otherMember
              ? [{ ...conversation.otherMember, id: conversation.otherMember._id }]
              : []
        }
        callType={callType}
        setCallType={setCallType}
      />
      <ChatInput />
    </ConversationContainer>
  );
};

export default ConversationPage;
