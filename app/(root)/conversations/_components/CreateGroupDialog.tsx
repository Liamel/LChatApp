'use client';

import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import { api } from '@/convex/_generated/api';
import { useMutationState } from '@/hooks/useMutationState';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from 'convex/react';
import { ConvexError } from 'convex/values';
import { PlusIcon, X } from 'lucide-react';
import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
const CreateGroupFormSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  members: z.array(z.string()).min(1, { message: 'At least one member is required' }),
});

type CreateGroupFormType = z.infer<typeof CreateGroupFormSchema>;

const CreateGroupDialog = () => {
  const friends = useQuery(api.friends.get);

  const { mutate: createGroup, pending } = useMutationState(api.friends.createGroup);

  const form = useForm<CreateGroupFormType>({
    resolver: zodResolver(CreateGroupFormSchema),
    defaultValues: {
      name: '',
      members: [],
    },
  });

  const members = form.watch('members', []);

  const unselectedFriends = useMemo(() => {
    return friends?.filter(friend => !members.includes(friend._id));
  }, [friends, members]);

  const handleSubmit = async (data: CreateGroupFormType) => {
    await createGroup({
      name: data.name,
      members: data.members,
    })
      .then(() => {
        form.reset();
        toast.success('Group created successfully');

      })
      .catch(error => {
        toast.error(error instanceof ConvexError ? error.data : 'Something went wrong');
      });
  };

  return (
    <Dialog>
      <Tooltip>
        <TooltipTrigger>
          <DialogTrigger asChild>
              <PlusIcon className="w-4 h-4" />
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Create Group</p>
        </TooltipContent>
      </Tooltip>
      <DialogContent className="block">
        <DialogHeader>
          <DialogTitle>Create Group</DialogTitle>
          <DialogDescription>Create a new group</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Group name..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="members"
              render={() => (
                <FormItem>
                  <FormLabel>Members</FormLabel>
                  <FormControl>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild disabled={unselectedFriends?.length === 0}>
                        <Button variant="outline" className="w-full">
                          Select
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-full">
                        {unselectedFriends?.map(friend => (
                          <DropdownMenuCheckboxItem
                            key={friend._id}
                            className="flex items-center gap-2 w-full p-2"
                            onCheckedChange={checked => {
                              if (checked) {
                                form.setValue('members', [...members, friend._id]);
                              }
                            }}
                          >
                            <Avatar>
                              <AvatarImage src={friend.imageUrl} />
                              <AvatarFallback>{friend.username.substring(0, 1)}</AvatarFallback>
                            </Avatar>
                            <h4 className="text-sm font-medium truncate">{friend.username}</h4>
                          </DropdownMenuCheckboxItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {members.length > 0 && (
              <Card className="flex items-center flex-row gap-3 overflow-x-auto w-full h-24 p-2 no-scrollbar">
                {friends
                  ?.filter(friend => members.includes(friend._id))
                  .map(friend => (
                    <div key={friend._id} className="flex  items-center gap-2">
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={friend.imageUrl} />
                          <AvatarFallback>{friend.username.substring(0, 1)}</AvatarFallback>
                        </Avatar>
                        <X
                          className="text-muted-foreground absolute bottom-8 left-7 rounded-full cursor-pointer bg-muted right-0 w-4 h-4"
                          onClick={() => {
                            form.setValue(
                              'members',
                              members.filter(id => id !== friend._id)
                            );
                          }}
                        />
                      </div>
                    </div>
                  ))}
              </Card>
            )}
            <DialogFooter>
                <Button type="submit" disabled={pending}>Create</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupDialog;
