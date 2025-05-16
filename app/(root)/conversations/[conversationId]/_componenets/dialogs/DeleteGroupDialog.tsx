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

export const DeleteGroupDialog = ({ open, setOpen, conversationId }: Props) => {
  const {mutate: deleteGroup, pending} = useMutationState(api.conversation.deleteGroup);

  const handleDeleteGroup = async() => {
    deleteGroup({
      conversationId: conversationId,
    }).then(() => {
      toast.success('Group deleted');
    }).catch((error:any) => {
      toast.error(error instanceof ConvexError ? error.data : 'Failed to delete group');
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
        <AlertDialogAction onClick={handleDeleteGroup} disabled={pending}>
          {pending ? 'Deleting...' : 'Delete'}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
  
  
};

export default DeleteGroupDialog;
