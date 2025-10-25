import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

import PageComponent from "@/_components/page/index/page";

export default async function Page() {
  return (
    <div className="mx-auto max-w-2xl space-y-8 p-8">
      <header className="mx-auto grid h-fit w-full grid-flow-col items-center justify-between">
        <p className="font-bold text-xl">
          <a href="/">Botoco</a>
        </p>
        <nav className="grid grid-flow-col items-center gap-4">
          <SignedOut>
            <SignInButton />
            <SignUpButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </nav>
      </header>
      <PageComponent />
      <footer className="text-center text-xs">
        <p>© 2025 Botoco</p>
      </footer>
    </div>
  );
}
