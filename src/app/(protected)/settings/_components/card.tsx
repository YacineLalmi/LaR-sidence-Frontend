import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import React from "react";

interface Props {
  link: string;
  title: string;
  icon: any;
}
export default function SettingCard(props: Props) {
  return (
    <Link href={props.link}>
      <Card className="bg-[#C8AB68CC] rounded-[40px] gap-0 p-0 overflow-hidden border-2 hover:bg-amber-200 transition">
        <CardContent className="flex items-center justify-center p-10 ">
          <props.icon size={25} className="w-16 h-16" color="white" />
        </CardContent>
        <CardFooter className="bg-[#e3d2a9cc] font-semibold text-[28px] p-5 text-white max-h-[64px] overflow-hidden whitespace-nowrap text-ellipsis">
          {props.title}
        </CardFooter>
      </Card>
    </Link>
  );
}
