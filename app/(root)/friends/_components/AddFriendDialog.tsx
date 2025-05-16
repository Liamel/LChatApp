'use client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Tooltip } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { UserPlusIcon } from 'lucide-react';
import { FormControl, FormField, FormLabel, FormMessage } from '@/components/ui/form';
import { FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useMutationState } from '@/hooks/useMutationState';
import { api } from '@/convex/_generated/api';
import { toast } from 'sonner';
import { ConvexError } from 'convex/values';

const addFriendFormSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid email address')
    .min(1, { message: 'Email is required' }),
});

type AddFriendFormSchema = z.infer<typeof addFriendFormSchema>;

const AddFriendDialog = () => {
  const { pending, mutate: createRequest } = useMutationState(api.request.create);

  const form = useForm<AddFriendFormSchema>({
    resolver: zodResolver(addFriendFormSchema),
    defaultValues: {
      email: '',
    },
  });

  const handleSubmit = async (data: AddFriendFormSchema) => {
    await createRequest({
      email: data.email,
    })
      .then(() => {
        toast.success('Request sent');
        form.reset();
      })
      .catch(err => {
        console.log('Error details:', err);
        toast.error(err instanceof ConvexError ? err.data : 'Something went wrong');
      });
  };

  return (
    <Dialog>
      <Tooltip>
        <TooltipTrigger>
          <DialogTrigger asChild>
            <UserPlusIcon />
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>Add Friend</TooltipContent>
      </Tooltip>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Friend</DialogTitle>
          <DialogDescription>Send a request to connect with your friends!</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button disabled={pending} type="submit" className="w-full">
                {pending ? 'Sending...' : 'Add'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddFriendDialog;
