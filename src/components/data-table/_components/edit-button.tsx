import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import Link from "next/link";
import React from "react";

interface Props {
  link: string;
}
export default function TebleEditButton({ link }: Props) {
  return (
    <Link href={link}>
      <Button variant="ghost" size="sm" className="cursor-pointer" title="modifier">
        <Edit className="h-4 w-4" />
      </Button>
    </Link>
  );
}
