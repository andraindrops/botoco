import { SignedIn, SignedOut, SignIn, UserButton } from "@clerk/nextjs";

export default function Page() {
  return (
    <div>
      <SignedOut>
        <SignIn />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  );
}
