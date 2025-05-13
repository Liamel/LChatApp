import ConversationFallback from '@/components/shared/conversation/ConversationFallback';
import ItemList from '@/components/shared/item-list/ItemList';
import React from 'react';
import AddFriendDialog from './_components/AddFriendDialog';

type Props = React.PropsWithChildren<{}>;

const FriendsPage = ({}: Props) => {
  return (
    <>
      <ItemList action={<AddFriendDialog />} title="Friends">
        Friends Page
      </ItemList>
      <ConversationFallback />
    </>
  );
};
export default FriendsPage;
