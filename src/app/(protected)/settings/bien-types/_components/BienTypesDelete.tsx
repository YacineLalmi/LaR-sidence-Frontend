import { deleteBienTypeAction, DeleteBienTypeState } from "@/actions/BienTypes/delete.action";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { customToast } from "@/lib/utils";
import { User } from "@/schemas/user.schema";
import { useRouter } from "next/navigation";
import React, { useActionState, useEffect } from "react";

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  item: User | null;
}
export default function BienTypeDelete({ open, setOpen, item }: Props) {
  const router = useRouter();
  const initialState: DeleteBienTypeState = { isOk: "UNDEFINED" };
  const [state, formAction, isPending] = useActionState(deleteBienTypeAction, initialState);

  useEffect(() => {
    if (state.isOk === "NOK") {
      customToast.error(state.errorMessage || "");
    } else if (state.isOk === "OK") {
      setOpen(false);
      router.refresh();
      customToast.success("Status ajouté avec succès");
    }
  }, [state]);
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpen(false)}>Cancel</AlertDialogCancel>
          <form action={formAction}>
            <input type="hidden" name="id" value={item?.id ?? ""} />
            <AlertDialogAction disabled={isPending} type="submit">Continue</AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
