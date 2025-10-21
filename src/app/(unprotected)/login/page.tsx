import { GalleryVerticalEnd } from "lucide-react";
import { LoginForm } from "./_components/login-form";
import Carousel from "./_components/carousel/carousel";

export default function LoginPage() {
  return (
    <div className="flex gap-1 h-screen items-center p-2">
      <div className="w-3/5 h-full">
        <Carousel />
      </div>
      <div className="w-2/5">
        <LoginForm />
      </div>
    </div>
  );
}
