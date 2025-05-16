import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Dialog } from '@/components/ui/dialog';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useMutationState } from '@/hooks/useMutationState';
import { ConvexError } from 'convex/values';
import { Dispatch, SetStateAction } from 'react';
import { toast } from 'sonner';

type Props = {
  conversationId: Id<'conversations'>;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const RemoveFriendDialog = ({ open, setOpen, conversationId }: Props) => {
  const {mutate: removeFriend, pending} = useMutationState(api.friend.remove);

  const handleRemoveFriend = async() => {
    removeFriend({
      conversationId: conversationId,
    }).then(() => {
      toast.success('Friend removed');
    }).catch((error:any) => {
      toast.error(error instanceof ConvexError ? error.data : 'Failed to remove friend');
    });
  };

  return <AlertDialog open={open} onOpenChange={setOpen}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={handleRemoveFriend} disabled={pending}>
          {pending ? 'Removing...' : 'Remove'}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
  
  
};

export default RemoveFriendDialog;
