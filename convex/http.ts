import { httpRouter } from 'convex/server';
import { httpAction } from './_generated/server';
import { WebhookEvent } from '@clerk/nextjs/server';
import { Webhook } from 'svix';
import { internal } from './_generated/api';

const validateRequest = async (req: Request): Promise<WebhookEvent | undefined> => {
  const payload = await req.text();
  const svixHeaders = {
    'svix-id': req.headers.get('svix-id')!,
    'svix-signature': req.headers.get('svix-signature')!,
    'svix-timestamp': req.headers.get('svix-timestamp')!,
  };
  const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET || '');
  console.log(process.env.CLERK_WEBHOOK_SECRET);
  try {
    const event = webhook.verify(payload, svixHeaders) as WebhookEvent;
    return event;
  } catch (err) {
    console.error('Error verifying webhook', err);
    return;
  }
};

const handleClerkWebhook = httpAction(async (ctx, req) => {
  const event = await validateRequest(req);
  if (!event) {
    return new Response('Could not validate Clerk request', { status: 400 });
  }
  switch (event.type) {
    case 'user.created':
      console.log('User created', event.data);
      const user = await ctx.runQuery(internal.user.get, { clerkId: event.data.id });
      if (user) {
        console.log(`Updating user ${user._id} with clerk data ${event.data}`);
      }
    //    break;
    case 'user.updated':
      console.log(`Created/User updated ${event.data.id}`);
      await ctx.runMutation(internal.user.create, {
        username: `${event.data.first_name} ${event.data.last_name}`,
        imageUrl: event.data.image_url,
        clerkId: event.data.id,
        email: event.data.email_addresses[0].email_address,
      });
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
      break;
  }
  return new Response('Webhook processed successfully', { status: 200 });
});

const http = httpRouter();

http.route({
  path: '/clerk-users-webhook',
  method: 'POST',
  handler: handleClerkWebhook,
});

export default http;
