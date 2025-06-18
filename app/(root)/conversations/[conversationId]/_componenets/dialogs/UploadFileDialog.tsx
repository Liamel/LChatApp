'use client'

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useConversation } from "@/hooks/useConversation";
import { useMutationState } from "@/hooks/useMutationState";
import { api } from "@/convex/_generated/api";
import { ConvexError } from "convex/values";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import { ImageIcon , FileIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import  Uploader  from "@/components/shared/uploader";

type Props = {

    open: boolean;
    toggle: (newState: boolean) => void;
    type: 'image'| 'file';
}


const uploadFileSchema = z.object({
    files: z.string().array().min(1, {message: 'At least one file is required'}),
})

const UploadFileDialog = ({open, toggle, type}: Props) => {
    const form = useForm<z.infer<typeof uploadFileSchema>>({
        resolver: zodResolver(uploadFileSchema),
        defaultValues: {
            files: [],
        },
    })
    const { conversationId } = useConversation();


    const files = form.watch('files')

    const { mutate: createMessage, pending } = useMutationState(api.message.create)

    const handleSubmit = async (values: z.infer<typeof uploadFileSchema>) => {
        createMessage({
          conversationId,
          content: values.files,
          type: type,
        })
          .then(() => {
            form.reset();
            toggle(false);
          })
          .catch(error => {
            toast.error(error instanceof ConvexError ? error.data : 'Something went wrong');
          });
      };
    

    return <Dialog open={open} onOpenChange={open => toggle(open)}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          {type === 'image' ? <ImageIcon className="w-4 h-4" /> : <FileIcon className="w-4 h-4" />}
        </Button>
      </DialogTrigger>
      <DialogContent className="fixed inset-0 z-50 max-h-[50vh] flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-[425px] max-h-[50vh] overflow-y-auto bg-background rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle>Upload {type === 'image' ? 'Image' : 'File'}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="files"
                render= {() => {
                  return <FormItem>
                    <FormControl>
                      <div className="py-4">
                        <Uploader type = {type}
                        onChange= {(urls) => {
                          const newFiles = [...files, ...urls];
                          form.setValue('files', newFiles, { shouldValidate: true });
                        }}>
                        </Uploader>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                }}
              />
              <DialogFooter>
                <Button type="submit" disabled={pending}>
                  {pending ? 'Uploading...' : 'Send'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
}

export default UploadFileDialog;