"use client";

import { createWilayaAction } from "@/actions/wilayas/create.action";
import InputTextField from "@/components/custom-inputs/input-text";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { customToast } from "@/lib/utils";
import { WilayaForm, WilayaFormSchema } from "@/schemas/wilayas/wilaya-form.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";

export default function CreateWilayaDialog() {
  const [isPending, setIsPending] = useState<boolean>(false);
  const router = useRouter();
  const bienTranslation = useTranslations("settings.wilayas.form");
  const commonTranslation = useTranslations("common");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const form = useForm<WilayaForm>({
    resolver: zodResolver(WilayaFormSchema),
    defaultValues: {
      name: "",
      code: "",
    },
  });

  async function onSubmit(values: WilayaForm) {
    setIsPending(true);
    try {
      const response = await createWilayaAction(values);
      setIsPending(false);
      if (response.isOk) {
        router.refresh();
        setIsOpen(false);
        customToast.success(commonTranslation("success.operationcompleted"));
      } else customToast.error(response.errorMessage || commonTranslation("errors.somethingwrong"));
    } catch (error) {
      customToast.error(commonTranslation("errors.somethingwrong"));
    }
  }

  async function onInvalid(values: any) {
    const [field, error] = Object.entries(values)[0] as [string, { message: string }];
    customToast.error(`${field}: ${error.message}`);
  }

  const handleDialogOpen = useCallback((isOpen: boolean) => {
    setIsOpen(isOpen);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogOpen}>
      <form>
        <DialogTrigger asChild>
          <Button className="cursor-pointer p-6 rounded-4xl flex gap-1 hover:bg-amber-200 hover:text-black hover:border-gray-600 border-1">
            <Plus />
            {bienTranslation(`buttonText`)}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]" onInteractOutside={(event) => event.preventDefault()}>
          <DialogHeader>
            <DialogTitle>{bienTranslation("title")}</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit, onInvalid)}
              className="grid grid-cols-1 gap-3"
              id="create-wilaya-form"
            >
              <InputTextField
                control={form.control}
                name="code"
                label={bienTranslation("label.code")}
                disabled={isPending}
                required
                placeholder={bienTranslation("placeholder.code")}
              />
              <InputTextField
                control={form.control}
                name="name"
                label={bienTranslation("label.name")}
                disabled={isPending}
                required
                placeholder={bienTranslation("placeholder.name")}
              />
            </form>
          </Form>
          <DialogFooter>
            <Button className="border-1 cursor-pointer w-36 p-5 ml-auto" type="submit" form="create-wilaya-form">
              {commonTranslation("add")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
