import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Id } from '@/convex/_generated/dataModel';
import { UserIcon } from 'lucide-react';
import Link from 'next/link';

type Props = {
  id: Id<'conversations'>;
  imageUrl: string;
  username: string;
  email: string;
  unseenCount?: number;
  lastMessageSender?: string;
  lastMessageContent?: string;
};

export const DMConversation = ({
  id,
  imageUrl,
  unseenCount,
  username,
  lastMessageSender,
  lastMessageContent,
}: Props) => {
  return (
    <Link href={`/conversations/${id}`} className="w-full">
      <Card className="p-2 flex justify-between w-full">
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <Avatar className="h-12 w-12 flex-shrink-0">
            <AvatarImage src={imageUrl} />
            <AvatarFallback>
              <UserIcon className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col truncate min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="truncate">{username}</h4>
              {unseenCount ? (
                <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground text-sm flex-shrink-0 ml-2">
                  {unseenCount}
                </div>
              ) : null}
            </div>
            <div className="text-sm text-muted-foreground truncate">
              {lastMessageSender && lastMessageContent ? (
                <span className="text-sm text-muted-foreground flex truncate overflow-ellipsis">
                  <p className="font-semibold">
                    {lastMessageSender} {':'}&nbsp;
                  </p>
                  <p className="truncate overflow-ellipsis">{lastMessageContent}</p>
                </span>
              ) : (
                'Start conversation'
              )}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};
