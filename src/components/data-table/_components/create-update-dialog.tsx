"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputField } from "@/lib/definitions";
import { customToast } from "@/lib/utils";
import { useActionState, useEffect } from "react";

export interface CreateOrUpdateModalProps {
  isOpen: boolean;
  close: () => void;
  modalHeader: string;
  modaldescription: string;
  action: any;
  actionInitialState: any;
  inputs: InputField[];
}

export function CreateUpdateDialog(props: CreateOrUpdateModalProps) {
  const [state, formAction, isPending] = useActionState(props.action, props.actionInitialState);

  useEffect(() => {
    if (state) {
      if (state.isOk === "NOK") {
        customToast.error(state.errorMessage || "");
      } else if (state.isOk === "OK") {
        customToast.success("OK");
      }
    }
  }, [state]);
  return (
    <Dialog
      open={props.isOpen}
      onOpenChange={(isOpen) => {
        if (!isOpen) return;
        props.close();
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{props.modalHeader}</DialogTitle>
          <DialogDescription>{props.modaldescription}</DialogDescription>
        </DialogHeader>
        <form className="space-y-4" action={formAction} id="create-update-form">
          {props.inputs &&
            props.inputs.map((input) => {
              if (input.type === "text") {
                return (
                  <div className="grid gap-3" key={input.id}>
                    <Label htmlFor={input.id}>{input.label}</Label>
                    <Input
                      id={input.id}
                      defaultValue={""}
                      type="text"
                      name={input.name}
                      placeholder={input.placeholder}
                      disabled={isPending}
                      required
                    />
                    <span className="text-sm text-red-500">
                      {state && state.errorDetails && state.errorDetails[input.name]}
                    </span>
                  </div>
                );
              }
            })}
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={props.close}>
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" form="create-update-form">
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
