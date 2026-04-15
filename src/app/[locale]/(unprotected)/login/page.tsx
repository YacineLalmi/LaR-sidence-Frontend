import CustomCarousel from "../_components/carousel";
import { LoginForm } from "./_components/login-form";

export default function LoginPage() {
  return (
    /* - min-h-screen au lieu de h-screen pour éviter les problèmes de défilement sur mobile
       - flex-col par défaut (mobile)
       - lg:flex-row pour les écrans larges (Desktop)
    */
    <div className="flex flex-col xl:flex-row gap-1 h-screen items-center p-2">
      {/* Carousel : 
          - hidden : masqué par défaut sur mobile
          - lg:block : affiché uniquement à partir des écrans larges
          - lg:w-3/5 : prend 60% de la largeur sur desktop
      */}
      <div className="hidden xl:w-3/5 h-full  xl:flex items-center justify-center">
        <CustomCarousel />
      </div>

      {/* Formulaire : 
          - w-full : prend toute la largeur sur mobile
          - lg:w-2/5 : prend 40% sur desktop
          - flex items-center justify-center : pour bien centrer le formulaire verticalement
      */}
      <div className="w-full max-w-2xl xl:w-2/5 flex items-center justify-center p-4">
        <LoginForm />
      </div>
    </div>
  );
}
