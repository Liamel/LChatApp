import { Button } from '@/components/ui/button';
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <SignedOut>
        <div className="flex gap-4">
          <SignInButton mode="modal">
            <Button>Sign In</Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button variant="outline">Sign Up</Button>
          </SignUpButton>
        </div>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  );
  return null;
}
