import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { login, LoginState } from "@/actions/authentication/login.action";

export default function useViewModel() {
  const router = useRouter();
  const LoginInitailState: LoginState = {
    data: {
      username: "",
      password: "",
    },
    form: {
      isOk: "UNDEFINED",
      errorMessage: "",
      errorDetails: { username: [""], password: [""] },
    },
  };

  const [state, formAction, isPending] = useActionState(login, LoginInitailState);

  return {
    formAction,
    state,
    isPending,
    router,
  };
}
