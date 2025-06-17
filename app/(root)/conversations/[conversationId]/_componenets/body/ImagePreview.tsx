import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import Image from 'next/image';

type Props = {
  urls: string[];
};

const ImagePreview = ({ urls }: Props) => {
  const isVideoFile = (filename: string) => {
    const videoFilePattern = /\.mp4$|\.mov$|\.avi$|\.wmv$|\.flv$|\.mkv$|\.webm$/i;
    return videoFilePattern.test(filename);
  };

  return (
    <div
      className={cn('grid gap-2 justify-items-start', {
        'grid-cols-1': urls.length === 1,
        'grid-cols-2': urls.length === 2,
        'grid-cols-3': urls.length === 3,
        'grid-cols-4': urls.length === 4,
      })}
    >
      {urls.map((url, index) => {
        const isVideo = isVideoFile(url);
        return (
          <Dialog key={index}>
            <div
              className={cn('relative cursor-pointer', {
                'w-28 h-28 max-w-full': !isVideo,
              })}
            >
              <DialogTrigger asChild>
                {isVideo ? (
                  <div className="aspect-w-16 aspect-h-9 h-full rounded-md">
                    <video poster={url} className="w-full h-full object-cover rounded-md">
                      <source src={`${url}#t=0.1`} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ) : (
                  <div className="w-28 h-28 max-w-full rounded-md">
                    <Image
                      src={url}
                      alt="Image"
                      referrerPolicy="no-referrer"
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                )}
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{isVideo ? 'Video Preview' : 'Image Preview'}</DialogTitle>
                </DialogHeader>
                <div className="w-full h-80 relative flex items-center justify-center">
                  {isVideo ? (
                    <video
                      src={`${url}#t=0.1`}
                      className="w-full h-full object-cover rounded-md"
                      controls
                      poster={url}
                    />
                  ) : (
                    <Image
                      src={url}
                      alt="Image"
                      referrerPolicy="no-referrer"
                      fill
                      objectFit="contain"
                      className="object-cover rounded-md"
                    />
                  )}
                </div>
              </DialogContent>
            </div>
          </Dialog>
        );
      })}
    </div>
  );
};

export default ImagePreview;
