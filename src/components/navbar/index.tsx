import React from "react";
import { Card, CardContent } from "../ui/card";
import CustomBreadCrumb from "./components/breadcrumb";
import Settings from "./components/settings";
import Profile from "./components/profile";

export default function NavBar() {
  return (
    <Card className="rounded-none w-full bg-transparent border-none shadow-none mt-4 p-0">
      <CardContent className="flex justify-end items-center">
        <Settings />
        <Profile />
      </CardContent>
    </Card>
  );
}
