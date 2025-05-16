import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { MessageSquareIcon, UserIcon } from 'lucide-react';
import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';

export const useNavigation = () => {
  const pathname = usePathname();

  const requestsCount = useQuery(api.requests.count);

  const conversations = useQuery(api.conversations.get);

  const unseenMessagesCount = useMemo(() => {

    return conversations?.reduce((acc, current) => {
      return acc + (current.unseenCount || 0);
    }, 0);
  }, [conversations]);


  const paths = useMemo(
    () => [
      {
        name: 'Conversations',
        href: '/conversations',
        icon: <MessageSquareIcon />,
        active: pathname.startsWith('/conversations'),
        count: unseenMessagesCount,
      },
      {
        name: 'Friends',
        href: '/friends',
        icon: <UserIcon />,
        count: requestsCount,
        active: pathname.startsWith('/friends'),
      },
    ],
    [pathname, requestsCount, unseenMessagesCount]
  );

  return paths;
};
