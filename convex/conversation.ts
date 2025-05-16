import { ConvexError, v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { getUserByClerkId } from './_utils';

export const get = query({
  args: {
    id: v.id('conversations'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthorized');
    }

    const currentUser = await getUserByClerkId(ctx, identity.subject);

    if (!currentUser) {
      throw new ConvexError('User not found');
    }

    const conversation = await ctx.db.get(args.id);

    if (!conversation) {
      throw new ConvexError('Conversation not found');
    }

    const membership = await ctx.db
      .query('conversationMembers')
      .withIndex('by_memberId_conversationId', q =>
        q.eq('memberId', currentUser._id).eq('conversationId', conversation._id)
      )
      .unique();

    if (!membership) {
      throw new ConvexError('You are not a member of this conversation');
    }

    const allConversationMemberships = await ctx.db
      .query('conversationMembers')
      .withIndex('by_conversationId', q => q.eq('conversationId', args.id))
      .collect();

    if (!conversation.isGroup) {
      const otherMembership = allConversationMemberships.filter(
        membership => membership.memberId !== currentUser._id
      )[0];

      if (!otherMembership) {
        throw new ConvexError('Other membership not found');
      }

      const otherMemberDetails = await ctx.db.get(otherMembership.memberId);

      if (!otherMemberDetails) {
        throw new ConvexError('Other member not found');
      }

      return {
        ...conversation,
        otherMember: {
          ...otherMemberDetails,
          lastSeenMessageId: membership.lastSeenMessageId,
        },
        otherMembers: null,
      };
    } else {
      const otherMembers = await Promise.all(
        allConversationMemberships
          .filter(membership => membership.memberId !== currentUser._id)
          .map(async membership => {
            const member = await ctx.db.get(membership.memberId);
            if (!member) {
              throw new ConvexError('Member not found');
            }
            return { username: member?.username, imageUrl: member?.imageUrl , _id: member._id };
          })
      );
      return {
        ...conversation,
        otherMembers,
        otherMember: null,
      };
    }
  },
});

export const deleteGroup = mutation({
  args: {
    conversationId: v.id('conversations'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthorized');
    }

    const currentUser = await getUserByClerkId(ctx, identity.subject);

    if (!currentUser) {
      throw new ConvexError('User not found');
    }

    const conversation = await ctx.db.get(args.conversationId);

    if (!conversation) {
      throw new ConvexError('Conversation not found');
    }

    const memberships = await ctx.db
      .query('conversationMembers')
      .withIndex('by_conversationId', q => q.eq('conversationId', args.conversationId))
      .collect();
    console.log(memberships);
    if (!memberships || memberships.length <= 1) {
      throw new ConvexError('This conversation does not have any members');
    }

    const messages = await ctx.db
      .query('messages')
      .withIndex('by_conversationId', q => q.eq('conversationId', args.conversationId))
      .collect();

    if (!messages || messages.length === 0) {
      throw new ConvexError('No messages found');
    }

    await ctx.db.delete(args.conversationId);
    await Promise.all(
      memberships.map(async m => {
        await ctx.db.delete(m._id);
      })
    );
  },
});

export const leaveGroup = mutation({
  args: {
    conversationId: v.id('conversations'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthorized');
    }

    const currentUser = await getUserByClerkId(ctx, identity.subject);

    if (!currentUser) {
      throw new ConvexError('User not found');
    }

    const conversation = await ctx.db.get(args.conversationId);

    if (!conversation) {
      throw new ConvexError('Conversation not found');
    }

    const membership = await ctx.db
      .query('conversationMembers')
      .withIndex('by_memberId_conversationId', q =>
        q.eq('memberId', currentUser._id).eq('conversationId', args.conversationId)
      )
      .unique();
    if (!membership) {
      throw new ConvexError('you are not a member of this conversation');
    }

    await ctx.db.delete(membership._id);
  },
});

export const markRead = mutation({
    args: {
      conversationId: v.id('conversations'),
      messageId: v.id('messages'),
    },
    handler: async (ctx, args) => {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) {
        throw new Error('Unauthorized');
      }
  
      const currentUser = await getUserByClerkId(ctx, identity.subject);
  
      if (!currentUser) {
        throw new ConvexError('User not found');
      }
  
      const membership = await ctx.db
        .query('conversationMembers')
        .withIndex('by_memberId_conversationId', q =>
          q.eq('memberId', currentUser._id).eq('conversationId', args.conversationId)
        )
        .unique();
      if (!membership) {
        throw new ConvexError('you are not a member of this conversation');
      }
  
      const lastMessage = await ctx.db.get(args.messageId);

      await ctx.db.patch(membership._id, {
        lastSeenMessageId: lastMessage ? lastMessage._id : undefined,
      });
    },
  });