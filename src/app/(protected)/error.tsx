"use client"; // Error boundaries must be Client Components

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import { useEffect } from "react";
import errorImage from "@/assests/images/Error.svg";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { ForbiddenError, UnauthorizedError } from "@/lib/utils";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Errroror", error.message);
  }, [error]);

  if (error instanceof ForbiddenError) {
    return (
      <Card className="flex h-full w-full items-center justify-center">
        <CardContent>
          <Image src={errorImage} alt="eefs" width={350} />
        </CardContent>
        <h2 className="font-bold text-2xl">Something went wrong!</h2>
        <span>ForbiddenError</span>
        <CardFooter>
          <Button
            className=" p-5 cursor-pointer"
            onClick={
              // Attempt to recover by trying to re-render the segment
              () => reset()
            }
          >
            <RefreshCcw />
            Try again
          </Button>
        </CardFooter>
      </Card>
    );
  } else if (error instanceof UnauthorizedError)
    return (
      <Card className="flex h-full w-full items-center justify-center">
        <CardContent>
          <Image src={errorImage} alt="eefs" width={350} />
        </CardContent>
        <h2 className="font-bold text-2xl">Something went wrong!</h2>
        <span>UnauthorizedError</span>
        <CardFooter>
          <Button
            className=" p-5 cursor-pointer"
            onClick={
              // Attempt to recover by trying to re-render the segment
              () => reset()
            }
          >
            <RefreshCcw />
            Try again
          </Button>
        </CardFooter>
      </Card>
    );
  else
    return (
      <Card className="flex h-full w-full items-center justify-center">
        <CardContent>
          <Image src={errorImage} alt="eefs" width={350} />
        </CardContent>
        <h2 className="font-bold text-2xl">Something went wrong!</h2>
        <span>{error && error.message}</span>
        <CardFooter>
          <Button
            className=" p-5 cursor-pointer"
            onClick={
              // Attempt to recover by trying to re-render the segment
              () => reset()
            }
          >
            <RefreshCcw />
            Try again
          </Button>
        </CardFooter>
      </Card>
    );
}
