import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { MessageSquareIcon, UserIcon } from 'lucide-react';

export const useNavigation = () => {
  const pathname = usePathname();

  const paths = useMemo(
    () => [
      {
        name: 'Conversations',
        href: '/conversations',
        icon: <MessageSquareIcon />,
        active: pathname.startsWith('/conversations'),
      },
      {
        name: 'Friends',
        href: '/friends',
        icon: <UserIcon />,
        active: pathname.startsWith('/friends'),
      },
    ],
    [pathname]
  );

  return paths;
};
