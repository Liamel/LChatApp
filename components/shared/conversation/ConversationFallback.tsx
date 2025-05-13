import { Card } from '@/components/ui/card';
import React from 'react';

const ConversationFallback = () => {
  return (
    <Card className="hidden lg:flex h-full w-full items-center justify-center  bg-secondary text-secondary-foreground">
      Select or start a conversation
    </Card>
  );
};

export default ConversationFallback;
