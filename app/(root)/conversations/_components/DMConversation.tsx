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
      <Card className="p-2 flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={imageUrl} />
            <AvatarFallback>
              <UserIcon className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col truncate">
            <h4 className="truncate">{username}</h4>
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
        {unseenCount ? (
          <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground text-sm">
            {unseenCount}
          </div>
        ) : null}
      </Card>
    </Link>
  );
};
