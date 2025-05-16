import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
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

export const LeaveGroupDialog = ({ open, setOpen, conversationId }: Props) => {
  const {mutate: leaveGroup, pending} = useMutationState(api.conversation.leaveGroup);

  const handleLeaveGroup = async() => {
    leaveGroup({
      conversationId: conversationId,
    }).then(() => {
      toast.success('Group left');
    }).catch((error:unknown) => {
      toast.error(error instanceof ConvexError ? error.data : 'Failed to leave group');
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
        <AlertDialogAction onClick={handleLeaveGroup} disabled={pending}>
          {pending ? 'Leaving...' : 'Leave'}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
  
  
};

export default LeaveGroupDialog;
