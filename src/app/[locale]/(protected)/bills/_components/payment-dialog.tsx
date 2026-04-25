"use client";

import { useState } from "react";
import { Bill } from "@/schemas/bills/bill.schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CreditCard, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import CustomButton from "@/components/ui/custom-button";
import { useForm } from "react-hook-form";
import { PaymentForm, PaymentFormSchema } from "@/schemas/payment/payment-form.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPaymentAction } from "@/actions/payment/create-payment.action";
import { customToast } from "@/lib/utils";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import InputTextArea from "@/components/custom-inputs/input-textarea";
import InputTextField from "@/components/custom-inputs/input-text";

interface PaymentDialogProps {
  bill: Bill;
}

export default function PaymentDialog({ bill }: PaymentDialogProps) {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const form = useForm<PaymentForm>({
    resolver: zodResolver(PaymentFormSchema),
    defaultValues: {
      amount: "",
      comment: "",
      reference: "",
    },
  });

  async function onSubmit(values: PaymentForm) {
    setIsPending(true);
    try {
      const response = await createPaymentAction(bill.id, values);

      if (response.isOk) {
        customToast.success(t(TRANSLATIONS_KEYS_2.COMMON.MESSAGES.OPERATION_COMPLETED));
        form.reset();
        setOpen(false);
      } else {
        customToast.error(response.errorMessage || t(TRANSLATIONS_KEYS_2.COMMON.MESSAGES.OPERATION_FAILED));
      }
    } catch (error) {
      customToast.error(t(TRANSLATIONS_KEYS_2.COMMON.MESSAGES.OPERATION_FAILED));
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <CustomButton Icon={CreditCard} size="icon" variant="ghost" className="!p-0" />
      </DialogTrigger>
      <DialogContent className="max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Paiement - #{bill.id.toString().padStart(6, "0")}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Amount Field */}
            <InputTextField
              control={form.control}
              name="amount"
              required
              disabled={isPending}
              label="amount"
              placeholder="amout"
            />

            {/* Reference Field */}
            <InputTextField
              control={form.control}
              name="reference"
              required
              disabled={isPending}
              label="reference"
              placeholder="reference"
            />

            {/* Comment Field */}
            <InputTextArea
              control={form.control}
              name="comment"
              required
              disabled={isPending}
              label="comment"
              placeholder="comment"
            />

            <DialogFooter className="pt-4">
              <CustomButton
                type="submit"
                disabled={isPending}
                className="w-full"
                text={
                  isPending
                    ? t(TRANSLATIONS_KEYS_2.COMMON.BUTTONS.CONFIRM)
                    : t(TRANSLATIONS_KEYS_2.COMMON.BUTTONS.CONFIRM)
                }
                Icon={isPending ? Loader2 : undefined}
              />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
