"use client";

import { BienTransaction } from "@/schemas/BienTransaction.schema";
import React, { useActionState, useEffect } from "react";
import { deleteBienTransactionAction, DeleteBienTransactionState } from "@/actions/BienTransaction/delete.action";
import { useRouter } from "next/navigation";
import { customToast } from "@/lib/utils";
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

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  item: BienTransaction | null;
}

export default function BienTransactionsDelete({ open, setOpen, item }: Props) {
  const router = useRouter();
  const initialState: DeleteBienTransactionState = { isOk: "UNDEFINED" };
  const [state, formAction, isPending] = useActionState(deleteBienTransactionAction, initialState);

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
            <AlertDialogAction disabled={isPending} type="submit">
              Continue
            </AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
