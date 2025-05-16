import SidebarWrapper from '@/components/shared/sidebar/SidebarWrapper';
import React from 'react';

type Props = React.PropsWithChildren<object>;

const Layout = ({ children }: Props) => {
  return (
    <>
      <SidebarWrapper>{children}</SidebarWrapper>
    </>
  );
};

export default Layout;
