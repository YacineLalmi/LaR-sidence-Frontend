import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User2 } from "lucide-react";

export default function Profile() {
  return (
    <div className="border-1 flex justify-center items-center p-1 cursor-pointer rounded-full">
      <User2 className="size-6" />
    </div>
  );
}
