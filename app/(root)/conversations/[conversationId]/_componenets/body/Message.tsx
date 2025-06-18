import React from 'react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ImagePreview from './ImagePreview';
import FilePreview from './FilePreview';
import {  PhoneIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type Props = {
  fromCurrentUser: boolean;
  content: string[];
  senderImage: string;
  senderName: string;
  lastByUser: boolean;
  createdAt: number;
  seen? : React.ReactNode;
  type: string;
};

export const Message = ({
  fromCurrentUser,
  content,
  senderImage,
  senderName,
  lastByUser,
  seen,
  createdAt,
  type,
}: Props) => {
  const formatTime = (timestamp: number) => {
    return format(timestamp, 'HH:mm');
  };
  return (
    <div
      className={cn('flex items-end', {
        'justify-end': fromCurrentUser,
      })} >
        <div className={cn('flex items-end gap-2', {
            'flex-row': fromCurrentUser,
            'flex-row-reverse': !fromCurrentUser,
        })}>
           <div className={cn('px-4 py-2 rounded-lg max-w-[90%]', {
            'bg-primary text-primary-foreground': fromCurrentUser,
            'bg-secondary text-secondary-foreground': !fromCurrentUser,
            'rounded-br-none': fromCurrentUser && !lastByUser,
            'rounded-bl-none': !fromCurrentUser && !lastByUser,
           })}>
            {type === 'text' ? <p className='whitespace-pre-wrap break-words text-wrap break-all'>
                {content[0]}
            </p> : type === 'image' ? <ImagePreview urls={content}/> : type === 'file' ? <FilePreview url={content[0]}/> : type === 'call' ?
            <Badge variant="secondary" className='text-xs'>
                <PhoneIcon className="w-4 h-4" />
                Call
            </Badge> : null}
            <p className={cn('text-xs flex w-full y-1', {
                'text-primary-foreground justify-end': fromCurrentUser,
                'text-secondary-foreground justify-start': !fromCurrentUser,
            })}>
                {formatTime(createdAt)}
            </p>
            {seen} 
           </div>

           <Avatar className= {cn('relative h-8 w-8', {
            'invisible': lastByUser,
           })}>
            <AvatarImage src={senderImage} />
            <AvatarFallback>
                {senderName.charAt(0).toUpperCase()}
           </AvatarFallback>
           </Avatar>
        </div>
    </div>
  );
};

export default Message;
