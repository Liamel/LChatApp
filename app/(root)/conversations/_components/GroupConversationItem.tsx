import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Id } from '@/convex/_generated/dataModel';
import Link from 'next/link';

type Props = {
  id: Id<'conversations'>;
  name: string;
  unseenCount?: number;
  lastMessageSender?: string;
  lastMessageContent?: string;
};

export const GroupConversationItem = ({
  id,
  name,
  unseenCount,
  lastMessageSender,
  lastMessageContent,
}: Props) => {
  return (
    <Link href={`/conversations/${id}`} className="w-full">
      <Card className="p-2 flex flex-row items-center justify-between">
        <div className='flex flex-row items-center gap-4'>
        <Avatar className="h-12 w-12">
          <AvatarFallback>
            {name.substring(0, 1).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col truncate">
          <h4 className="truncate">{name}</h4>
          <div className="text-sm text-muted-foreground truncate">
            {lastMessageSender && lastMessageContent
              ? <span className='text-sm text-muted-foreground flex truncate overflow-ellipsis'>
                  <p className='font-semibold'>{lastMessageSender} {':'}&nbsp;</p>
                  <p className='truncate overflow-ellipsis'>{lastMessageContent}</p>
                </span>
              : 'Start conversation'}
          </div>
        </div>
        </div>
        {unseenCount ? (
          <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground text-sm">
            {unseenCount}
          </div>
        ) : null}
      </Card>
    </Link>
  );
};
