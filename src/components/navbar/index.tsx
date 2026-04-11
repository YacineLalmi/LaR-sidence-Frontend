import React from "react";
import { Card, CardContent } from "../ui/card";
import Settings from "./components/settings";
import Profile from "./components/profile";
import { User } from "@/schemas/users/user.schema";

type Props = {
  user: User | null;
};

export default function NavBar({ user }: Props) {
  return (
    <Card className="mt-4 w-full rounded-none border-none bg-transparent p-0 pb-4 shadow-none sm:pb-6">
      <CardContent className="flex items-center justify-end gap-2 sm:gap-3">
        <Settings />
        <Profile user={user} />
      </CardContent>
    </Card>
  );
}
