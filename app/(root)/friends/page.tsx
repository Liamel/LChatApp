'use client';

import ConversationFallback from '@/components/shared/conversation/ConversationFallback';
import ItemList from '@/components/shared/item-list/ItemList';
import React from 'react';
import AddFriendDialog from './_components/AddFriendDialog';
import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import { Loader2 } from 'lucide-react';
import Request from './_components/Request';

type Props = React.PropsWithChildren<{}>;

const FriendsPage = ({}: Props) => {
  const requests = useQuery(api.requests.get);

  return (
    <>
      <ItemList action={<AddFriendDialog />} title="Friends">
        {requests ? (
          requests.length === 0 ? (
            <p className="text-center h-full flex items-center justify-center text-sm text-muted-foreground">No requests</p>
          ) : (
            requests.map(request => <Request key={request.request._id} 
              id={request.request._id} 
              imageUrl={request.sender.imageUrl} 
              username={request.sender.username} 
              email={request.sender.email} 
            />)
          )
        ) : (
          <Loader2 className="text-center h-full flex items-center justify-center text-sm  animate-spin" />
        )}
      </ItemList>
      <ConversationFallback />
    </>
  );
};
export default FriendsPage;
