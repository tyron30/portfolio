import Link from "next/link";
import { WifiOff, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="relative">
        <WifiOff className="mx-auto h-14 w-14 animate-pulse text-primary" />
        <h1 className="mt-6 font-display text-7xl font-bold sm:text-8xl">
          <span className="text-gradient">404</span>
        </h1>
      </div>
      <p className="mt-4 text-xl font-semibold">Connection lost</p>
      <p className="mt-2 max-w-md text-muted-foreground">
        The page you&apos;re looking for isn&apos;t on this network. It may have moved, or the link is wrong.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-transform hover:scale-105"
      >
        <ArrowLeft className="h-4 w-4" /> Back to portfolio
      </Link>
    </main>
  );
}
