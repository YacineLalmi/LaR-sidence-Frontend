import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import React from "react";

interface Props {
  id: string;
}
export default function TableDeleteButton({ id }: Props) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="cursor-pointer"
      title="supprimer"
      onClick={() => {
        alert("delete " + id);
      }}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
