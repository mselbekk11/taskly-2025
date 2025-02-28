"use client";

import { Authenticated, Unauthenticated } from "convex/react";
import { SignUpButton } from "@clerk/nextjs";
import { SignInButton } from "@clerk/nextjs";
// import { UserButton } from "@clerk/nextjs";
import TodoApp from "@/components/todo-app";

export default function Home() {
  return (
    <>
      {/* <header className="sticky top-0 z-10 bg-background p-4 border-b-2 border-slate-200 dark:border-slate-800 flex flex-row justify-between items-center">
        Convex + Next.js + Clerk
        <UserButton />
      </header> */}
      <main className="">
        <Authenticated>
          <Content />
        </Authenticated>
        <Unauthenticated>
          <SignInForm />
        </Unauthenticated>
      </main>
    </>
  );
}

function SignInForm() {
  return (
    <div className="h-screen justify-center items-center flex flex-col gap-8 w-96 mx-auto">
      <SignInButton mode="modal">
        <button className="bg-foreground text-background px-4 py-2 rounded-md w-full">
          Sign in
        </button>
      </SignInButton>
      <SignUpButton mode="modal">
        <button className="bg-foreground text-background px-4 py-2 rounded-md w-full">
          Sign up
        </button>
      </SignUpButton>
    </div>
  );
}

function Content() {
  return (
    <div>
      <TodoApp />
    </div>
  );
}
