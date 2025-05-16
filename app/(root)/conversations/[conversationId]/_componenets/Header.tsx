import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { ArrowLeftIcon, EllipsisIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

type Props = {
  imageUrl: string;
  name: string;
  options?: {
    label: string;
    destructive?: boolean;
    onClick: () => void;

  }[];
};

export const Header = ({ imageUrl, name, options }: Props) => {
  return (
    <Card className="flex flex-row rounded-md p-2 justify-between items-center">
      <div className="flex  items-center gap-2">
        <Link className="block lg:hidden" href="/conversations">
          <ArrowLeftIcon className="w-4 h-4" />
        </Link>
        <Avatar className="w-8 h-8">
          <AvatarImage src={imageUrl} />    
          <AvatarFallback>{name.substring(0, 1)}</AvatarFallback>
        </Avatar>
        <h2 className="text-lg font-semibold">{name}</h2>
      </div>
      <div className='flex gap-2'>
        { 
          options ? (<DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='secondary' size='icon'>
                <EllipsisIcon className='w-4 h-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {options.map((option, id) => (
                <DropdownMenuItem key={id} onClick={option.onClick} className={cn('font-semibold', {
                  'text-destructive': option.destructive,
                })}>
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </div>
    </Card>
  );
};

export default Header;