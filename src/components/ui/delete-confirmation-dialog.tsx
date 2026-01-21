"use client";
import React, { useCallback, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { TriangleAlert, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { TRANSLATIONS_KEYS } from "@/i18n/translation-constants";

interface Props {
  title?: string;
  description?: string;
  cancelText?: string;
  confirmText?: string;
  onConfirm: any;
  trigger: any;
  isOpen: boolean;
  setIsOpen: any;
}

export function DeleteConfirmationDialog({
  title,
  description,
  cancelText,
  confirmText,
  onConfirm,
  trigger,
  isOpen,
  setIsOpen,
}: Props) {
  const [isPending, setIsPending] = useState<boolean>(false);

  const handleConfirmClick = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsPending(true);
      await onConfirm(e).finally(() => setIsPending(false));
    },
    [onConfirm]
  );

  const translation = useTranslations();
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent className="max-w-md bg-white border-0 shadow-lg">
        <AlertDialogHeader className="items-center text-center">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto">
            <TriangleAlert size={50} strokeWidth={1} color="red" />
          </div>
          {title && <AlertDialogTitle className="text-xl font-semibold text-gray-900 text-center">{title}</AlertDialogTitle>}
          <AlertDialogDescription className="text-red-500 text-base text-center">
            {description ? description : translation(TRANSLATIONS_KEYS.COMMON.DELETE_CONFIRMATION_TEXT)}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-row gap-3 sm:justify-center">
          <AlertDialogCancel
            disabled={isPending}
            className="mt-0 px-8 py-2.5 border-2 border-gray-300 hover:bg-gray-50 rounded-lg font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText ? cancelText : translation(TRANSLATIONS_KEYS.COMMON.CANCEL_BUTTON_TEXT)}
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            onClick={handleConfirmClick}
            className="bg-black hover:bg-gray-800 text-white px-8 py-2.5 rounded-lg font-medium cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {confirmText ? confirmText : translation(TRANSLATIONS_KEYS.COMMON.CONFIRMATION_BUTTON_TEXT)}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
