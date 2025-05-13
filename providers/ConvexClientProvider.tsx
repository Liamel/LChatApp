'use client';

import { ClerkProvider, useAuth } from '@clerk/nextjs';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import { ConvexReactClient } from 'convex/react';
import React from 'react';

type Props = {
  children: React.ReactNode;
};

const URL = process.env.NEXT_PUBLIC_CONVEX_URL || '';

const convex = new ConvexReactClient(URL);

const ConvexClientProvider = ({ children }: Props) => {
  return (
    <ClerkProvider>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
};

export default ConvexClientProvider;
