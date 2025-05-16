'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useConversation } from '@/hooks/useConversation';
import { useMutationState } from '@/hooks/useMutationState';
import { api } from '@/convex/_generated/api';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { ConvexError } from 'convex/values';
import {  } from 'react';
import { Form, FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import  TextareaAutosize  from 'react-textarea-autosize';
import { SendHorizonal } from 'lucide-react';


const chatMessageSchema = z.object({
  content: z.string().min(1, { message: 'Message cannot be empty' }),
});

type ChatMessageType = z.infer<typeof chatMessageSchema>;

export const ChatInput = () => {

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const {value,selectionStart} = event.target;
    if (selectionStart !== null ) {
        form.setValue('content',value);
    }
  };

  const { conversationId } = useConversation();
  const { mutate: createMessage, pending } = useMutationState(api.message.create);
  const form = useForm<ChatMessageType>({
    resolver: zodResolver(chatMessageSchema),
    defaultValues: {
      content: '',
    },
  });

  const handleSubmit = async (values: ChatMessageType) => {
    createMessage({
      conversationId,
      content: [values.content],
      type: 'text',
    })
      .then(() => {
        form.reset();
      })
      .catch(error => {
        toast.error(error instanceof ConvexError ? error.data : 'Something went wrong');
      });
  };

  return (
    <Card className="flex flex-row rounded-md p-2 justify-between items-center">
      <div className="flex  items-end w-full gap-2">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex items-end w-full gap-2"
          >
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                 <FormItem className="flex-1">
                    <FormControl>
                        <TextareaAutosize rows={1} minRows={1} maxRows={4} onKeyDown={ async (e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                await form.handleSubmit(handleSubmit)();
                            }
                        }}
                        {...field} onChange={handleInputChange}
                        placeholder="Type a message" 
                        className="min-h-full w-full resize-none outline-0 border-0 bg-card text-card-foreground placeholder:text-muted-foreground p-1.5"
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" size="icon" disabled={pending} className="ml-auto">
                <SendHorizonal  />
            </Button>
          </form>
        </Form>
      </div>
    </Card>
  );
};

export default ChatInput;
