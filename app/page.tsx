import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  return (
    <section className="bg-gray-50">
      <div className="mx-auto flex min-h-screen max-w-screen-xl items-center px-4 py-32 lg:h-screen">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-extrabold sm:text-5xl">
            Compete with your friends.
            <strong className="bg-gradient-to-b from-yellow-900 to-orange-500 bg-clip-text pb-2 font-extrabold text-transparent sm:block">
              Improve your consistency.
            </strong>
          </h1>

          <p className="mt-4 sm:text-lg/relaxed">
            <span className="font-semibold text-yellow-800">
              LeetCode Buddy
            </span>{" "}
            helps you compare your progress in solving LeetCode problems with
            your friends. It&apos;s a fun way to improve your consistency and
            compete with your friends.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <SignedOut>
              <SignInButton>
                <button className="block w-full rounded bg-gradient-to-r from-yellow-600 to-orange-600 px-12 py-3 text-sm font-medium text-white shadow focus:outline-none focus:ring sm:w-auto">
                  Get Started
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link
                href={"/dashboard"}
                className="block w-full rounded bg-gradient-to-r from-yellow-600 to-orange-600 px-12 py-3 text-sm font-medium text-white shadow focus:outline-none focus:ring sm:w-auto"
              >
                Dashboard
              </Link>
            </SignedIn>

            <Link
              className="block w-full rounded px-12 py-3 text-sm font-medium text-yellow-700 shadow hover:text-orange-700 focus:outline-none focus:ring active:text-yellow-600 sm:w-auto"
              target="_blank"
              href="https://www.github.com/actuallyakshat/lc-buddy"
            >
              GitHub
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
