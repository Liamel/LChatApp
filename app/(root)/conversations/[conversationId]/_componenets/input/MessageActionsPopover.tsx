'use client';

import { Button } from '@/components/ui/button';
import { PlusCircle, Smile } from 'lucide-react';
import { PopoverTrigger, PopoverContent , Popover} from '@/components/ui/popover';
import { useState } from 'react';
import  UploadFileDialog  from '../dialogs/UploadFileDialog';

type Props = {
  setEmojiPickerOpen: (open: boolean) => void;
};

export const MessageActionsPopover = ({ setEmojiPickerOpen }: Props) => {
  const [uploadFileDialogOpen, setUploadFileDialogOpen] = useState(false);
  const [uploadImageDialogOpen, setUploadImageDialogOpen] = useState(false);

 
  return (
    <Popover>
      <PopoverContent className="w-full mb-1 flex flex-col gap-2">
        <UploadFileDialog open={uploadFileDialogOpen} toggle={(newState) => setUploadFileDialogOpen(newState)} type="file" />
        <UploadFileDialog open={uploadImageDialogOpen} toggle={(newState) => setUploadImageDialogOpen(newState)} type="image" />
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            setEmojiPickerOpen(true);
          }}
        >
          <Smile />
        </Button>
      </PopoverContent>
      <PopoverTrigger asChild>
        <Button variant="secondary" size="icon">
          <PlusCircle />
        </Button>
      </PopoverTrigger>
    </Popover>
  );
};
