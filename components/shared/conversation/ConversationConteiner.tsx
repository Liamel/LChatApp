import { Card } from '@/components/ui/card';
import React from 'react';

type Props = React.PropsWithChildren<{}>;

const ConversationContainer = ({ children }: Props) => {
  return (
    <Card className="h-[calc(100svh-32px)] lg:h-full p-2 gap-2 w-full flex flex-col">
      {children}
    </Card>
  );
};

export default ConversationContainer;
