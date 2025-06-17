import { auth } from '@clerk/nextjs/server';
import { createUploadthing, type FileRouter } from 'uploadthing/next';

const f = createUploadthing();

const handleAuth = async () => {
  const { userId } = await auth();

  if (!userId) throw new Error('Unauthorized');
  return { userId };
};

export const ourFileRouter = {
  image: f({
    image: { maxFileSize: '4MB', maxFileCount: 6 },
    video: { maxFileSize: '32MB', maxFileCount: 1 },
    audio: { maxFileSize: '32MB', maxFileCount: 1 },
  })
    .middleware(handleAuth)
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Upload complete for user', metadata.userId, file.ufsUrl);
    }),
  video: f({ video: { maxFileSize: '32MB', maxFileCount: 1 } })
    .middleware(handleAuth)
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Upload complete for user', metadata.userId, file.ufsUrl);
    }),
  audio: f({ audio: { maxFileSize: '32MB', maxFileCount: 1 } })
    .middleware(handleAuth)
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Upload complete for user', metadata.userId, file.ufsUrl);
    }),
  file: f({
    image: { maxFileSize: '4MB', maxFileCount: 6 },
    video: { maxFileSize: '32MB', maxFileCount: 1 },
    audio: { maxFileSize: '32MB', maxFileCount: 1 },
    pdf: { maxFileSize: '32MB', maxFileCount: 1 },
  })
    .middleware(handleAuth)
    .onUploadComplete(async ({ metadata, file }) => {
    console.log('Upload complete for user', metadata.userId, file.ufsUrl);
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
