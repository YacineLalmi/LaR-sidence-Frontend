import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { login, LoginState } from "@/actions/authentication/login.action";

export default function useViewModel() {
  const router = useRouter();
  const LoginInitailState: LoginState = {
    nom_utilisateur: "",
    mot_de_passe: "",
    isOk: "UNDEFINED",
    errorMessage: "",
    errorDetails: { nom_utilisateur: "", mot_de_passe: "" },
  };

  const [state, formAction, isPending] = useActionState(login, LoginInitailState);

  return {
    formAction,
    state,
    isPending,
    router,
  };
}
