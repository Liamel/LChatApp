'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ui/theme/theme-toggle';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useConversation } from '@/hooks/useConversation';
import { useNavigation } from '@/hooks/useNavigation';
import { cn } from '@/lib/utils';
import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';

const MobileNav = () => {
  const paths = useNavigation();

  const {isActive} = useConversation();

  if (isActive) return null;

  return (
    <Card className="fixed bottom-4 w-[calc(100vw-32px)] flex items-center h-16 p-2 lg:hidden">
      <nav className="w-full">
        <ul className="flex items-center justify-evenly w-full">
          {paths.map((path, id) => (
            <li key={id} className="relative">
              <Link href={path.href}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Button
                        variant={path.active ? 'default' : 'outline'}
                        size="icon"
                        className={cn(path.active && 'bg-primary text-primary-foreground')}
                      >
                        {path.icon}
                      </Button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{path.name}</p>
                  </TooltipContent>
                </Tooltip>
              </Link>
            </li>
          ))}
          <li>
            <ThemeToggle />
          </li>
          <li className="flex items-center justify-center">
            <UserButton />
          </li>
        </ul>
      </nav>
    </Card>
  );
};

export default MobileNav;
