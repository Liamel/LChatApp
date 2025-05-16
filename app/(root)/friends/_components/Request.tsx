import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useMutationState } from '@/hooks/useMutationState';
import { ConvexError } from 'convex/values';
import { CheckIcon, UserRoundIcon, X } from 'lucide-react';
import { toast } from 'sonner';
type Props = {
  id: Id<'requests'>;
  imageUrl: string;
  username: string;
  email: string;
};

const Request = ({ id, imageUrl, username, email }: Props) => {
  const { mutate: denyRequest, pending: denyPending } = useMutationState(api.request.deny);

  const { mutate: acceptRequest, pending: acceptPending } = useMutationState(api.request.accept);

  return (
    <Card className="flex flex-row  gap-2 w-full p-2 items-center justify-between">
      <div className="flex  gap-4 items-center truncate">
        <Avatar className="w-12 h-12">
          <AvatarImage src={imageUrl} />
          <AvatarFallback>
            <UserRoundIcon className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col truncate">
          <h4 className="text-sm font-semibold truncate">{username}</h4>
          <p className="text-xs text-muted-foreground truncate">{email}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" disabled={denyPending || acceptPending} onClick={() => acceptRequest({ id })
          .then(() => toast.success('Request accepted'))
          .catch((err) => toast.error(err instanceof ConvexError ? err.data : 'Something went wrong'))
        }>
          <CheckIcon className="w-4 h-4" />
        </Button>
        <Button
          variant="destructive"
          size="icon"
          disabled={denyPending || acceptPending}
          onClick={() =>
            denyRequest({ id })
              .then(() => toast.success('Request denied'))
              .catch((err) => toast.error(err instanceof ConvexError ? err.data : 'Something went wrong'))
          }
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};

export default Request;
