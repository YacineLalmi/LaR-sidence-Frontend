import { Card, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";
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
      <Card className="bg-transparent border-black border-2 hover:bg-amber-200 transition">
        <CardContent className="flex gap-3 items-center ">
          <div>
            <props.icon size={25} />
          </div>
          <div className="text-md"> {props.title}</div>
        </CardContent>
      </Card>
    </Link>
  );
}
