import React from "react";
import { Card, CardContent } from "../ui/card";
import CustomBreadCrumb from "./components/breadcrumb";
import Settings from "./components/settings";
import Profile from "./components/profile";

export default function NavBar() {
  return (
    <Card className="rounded-none w-full bg-transparent border-none shadow-none">
      <CardContent className="flex justify-between items-center">
        <CustomBreadCrumb />
        <div className="flex gap-3 items-center">
          <Settings />
          <Profile />
        </div>
      </CardContent>
    </Card>
  );
}
