'use client';

import { Card } from '@/components/ui/card';
import { useConversation } from '@/hooks/useConversation';
import { cn } from '@/lib/utils';
import React from 'react';

type Props = React.PropsWithChildren<{
  title: string;
  action?: React.ReactNode;
}>;

const ItemList = ({ children, title, action: Action }: Props) => {
  const { isActive } = useConversation();


  return (
    <Card
      className={cn('hidden h-full w-full lg:flex-none lg:w-80 p-2', {
        block: !isActive,
        'lg:block': isActive,
      })}
    >
      <div className="flex mb-4 items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {Action ? Action : null}
      </div>
      <div className="h-full w-full flex flex-col gap-2 items-center justify-start">{children}</div>
    </Card>
  );
};

export default ItemList;
