'use client';

import React from 'react';
import DesktopNav from './nav/DesktopNav';
import MobileNav from './nav/MobileNav';
type Props = React.PropsWithChildren<{}>;

const SidebarWrapper = ({ children }: Props) => {
  return (
    <div className="flex flex-col p-4  h-full w-full lg:flex-row gap-4">
      <DesktopNav />
      <MobileNav />
      <main className="h-[calc(100%-80px)] lg:h-full w-full flex gap-4">{children}</main>
    </div>
  );
};

export default SidebarWrapper;
