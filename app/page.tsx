import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-24 bg-zinc-950 text-white">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          DaxHive AI Bookkeeping&nbsp;
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <a href="/sign-in" className="px-4 py-2 border rounded hover:bg-white hover:text-black transition">Sign In</a>
          </SignedOut>
        </div>
      </div>

      <div className="relative flex place-items-center mt-20">
        <h1 className="text-6xl font-bold tracking-tighter">Welcome to the future of Bookkeeping</h1>
      </div>

      <div className="mt-12 text-center text-zinc-400 max-w-2xl">
        <p>Your local dev environment is running Next.js 16 and Clerk 6.36.10.</p>
      </div>
    </main>
  );
}
