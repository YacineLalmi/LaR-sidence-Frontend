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
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { FormState } from "@/lib/definitions";
import { customToast } from "@/lib/utils";

interface Props {
  title: string;
  description?: string;
  cancelText?: string;
  confirmText?: string;
  confirmAction: () => Promise<FormState>;
  trigger: any;
  isOpen: boolean;
  setIsOpen: any;
  onSuccess: () => void;
  successMessage?: string;
  errorMessage?: string;
}

export function DeleteConfirmationDialog({
  title,
  description,
  cancelText,
  confirmText,
  confirmAction,
  trigger,
  isOpen,
  setIsOpen,
  onSuccess,
  successMessage = TRANSLATIONS_KEYS_2.COMMON.MESSAGES.DELETED,
  errorMessage = TRANSLATIONS_KEYS_2.COMMON.MESSAGES.FAILED_DELETION,
}: Props) {
  const [isPending, setIsPending] = useState<boolean>(false);

  const handleConfirmClick = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      try {
        setIsPending(true);
        const response = await confirmAction();
        if (response.isOk) {
          onSuccess();
          customToast.success(translation(successMessage));
        } else customToast.error(response.errorMessage ?? translation(errorMessage));
      } catch (error) {
        customToast.error(translation(errorMessage));
      } finally {
        setIsPending(false);
      }
    },
    [confirmAction],
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
          {title && (
            <AlertDialogTitle className="text-xl font-semibold text-gray-900 text-center">{title}</AlertDialogTitle>
          )}
          <AlertDialogDescription className="text-red-500 text-base text-center">
            {description ? description : translation(TRANSLATIONS_KEYS_2.COMMON.MESSAGES.DELETE_CONFIRMATION_TEXT)}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-row gap-3 sm:justify-center">
          <AlertDialogCancel
            disabled={isPending}
            className="mt-0 px-8 py-2.5 border-2 border-gray-300 hover:bg-gray-50 rounded-lg font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText ? cancelText : translation(TRANSLATIONS_KEYS_2.COMMON.BUTTONS.CANCEL)}
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            onClick={handleConfirmClick}
            className="bg-black hover:bg-gray-800 text-white px-8 py-2.5 rounded-lg font-medium cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {confirmText ? confirmText : translation(TRANSLATIONS_KEYS_2.COMMON.BUTTONS.CONFIRM)}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
