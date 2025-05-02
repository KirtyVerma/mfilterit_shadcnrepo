"use client"; // Error boundaries must be Client Components

import { UnauthorizedError } from "@/common/errors";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
<<<<<<< HEAD
  useEffect(() => {
    switch (true) {
      case error instanceof UnauthorizedError:
        router.replace("/");
        break;
      default:
        console.log(error.message);
=======
  
  useEffect(() => {
    switch (true) {
      case error instanceof UnauthorizedError:
        // Store current path before redirect
        const currentPath = window.location.pathname;
        if (currentPath !== '/') {
          sessionStorage.setItem('redirectPath', currentPath);
        }
        sessionStorage.clear();
        window.location.href = '/';
        break;
      default:
>>>>>>> d1452b7 (Initial commit)
        console.error(error);
    }
  }, [error]);

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-2">
      <h2>Something went wrong!</h2>
      <Button
        className="rounded-md"
        variant="destructive"
        onClick={() => reset()}
      >
        Try again
      </Button>
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> d1452b7 (Initial commit)
