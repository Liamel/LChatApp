import ConversationContainer from '@/components/shared/conversation/ConversationConteiner';
import React from 'react';

type Props = React.PropsWithChildren<{
  params: {
    conversationId: string;
  };
}>;

const ConversationPage = ({ params }: Props) => {
  return (
    <>
      <ConversationContainer>
        <h1>Conversation {params.conversationId}</h1>
      </ConversationContainer>
    </>
  );
};

export default ConversationPage;
