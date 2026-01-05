"use client";

import { deleteDemandAction } from "@/actions/demands/delete.action";
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
import { useTranslations } from "next-intl";
import React, { useState } from "react";

interface Props {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  demandId: string;
  onSuccess?: () => void;
}

export default function DemandDelete({ isOpen, setIsOpen, demandId, onSuccess }: Props) {
  const [isPending, setIsPending] = useState(false);
  const t = useTranslations();

  const handleDelete = async () => {
    if (!demandId) return;

    setIsPending(true);
    try {
      const response = await deleteDemandAction(demandId);
      setIsPending(false);
      if (response.isOk) {
        customToast.success(t("common.success.operationcompleted"));
        setIsOpen(false);
        onSuccess?.();
      } else {
        customToast.error(response.errorMessage || t("common.errors.somethingwrong"));
      }
    } catch (error) {
      setIsPending(false);
      customToast.error(t("common.errors.somethingwrong"));
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("demands.delete.title")}</AlertDialogTitle>
          <AlertDialogDescription>{t("demands.delete.description")}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>{t("common.cancel")}</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isPending}>
            {t("common.confirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

