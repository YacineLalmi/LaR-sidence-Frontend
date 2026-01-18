import CustomCarousel from "../_components/carousel";
import { LoginForm } from "./_components/login-form";


export default function LoginPage() {
  return (
    <div className="flex gap-1 h-screen items-center p-2">
      <div className="w-3/5 h-full">
        <CustomCarousel />
      </div>
      <div className="w-2/5">
        <LoginForm />
      </div>
    </div>
  );
}
