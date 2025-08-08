"use client";
import { DeleteBienTypeState, deleteBienTypeAction } from "@/actions/BienTypes/delete.action";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import React, { useActionState, useEffect } from "react";
import { BienStatus } from "@/schemas/BienStatus.schema";
import { customToast } from "@/lib/utils";
import { deleteBienStatusAction } from "@/actions/BienStatus/delete.action";
import { useRouter } from "next/navigation";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  item: BienStatus | null;
}

export default function BienStatusDelete({ open, setOpen, item }: Props) {
  const router = useRouter();
  const initialState: DeleteBienTypeState = { isOk: "UNDEFINED" };
  const [state, formAction, isPending] = useActionState(deleteBienStatusAction, initialState);

  useEffect(() => {
    if (state.isOk === "NOK") {
      customToast.error(state.errorMessage || "");
    } else if (state.isOk === "OK") {
      setOpen(false);
      router.refresh()
      customToast.success("Status ajouté avec succès");
    }
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Supprimer le status</DialogTitle>
        </DialogHeader>
        <form action={formAction}>
          <input type="hidden" name="id" value={item?.id ?? ""} />
          <p>Êtes-vous sûr de vouloir supprimer ce status ?</p>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              Supprimer
            </Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
