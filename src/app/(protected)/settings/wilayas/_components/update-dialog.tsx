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
import { Edit, Plus } from "lucide-react";
import { updateWilayaAction } from "@/actions/wilayas/update.action";
import { Wilaya } from "@/schemas/wilayas/wilaya.schema";

interface Props {
  wilaya: Wilaya;
}

export default function UpdateWilayaDialog({ wilaya }: Props) {
  const [isPending, setIsPending] = useState<boolean>(false);
  const router = useRouter();
  const bienTranslation = useTranslations("settings.wilayas.form");
  const commonTranslation = useTranslations("common");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const form = useForm<WilayaForm>({
    resolver: zodResolver(WilayaFormSchema),
    defaultValues: {
      name: wilaya.name,
      code: wilaya.code,
    },
  });

  async function onSubmit(values: WilayaForm) {
    setIsPending(true);
    try {
      const response = await updateWilayaAction(values, wilaya.id);
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
          <Button variant="ghost" size="sm" className="cursor-pointer" title="modifier">
            <Edit className="h-4 w-4" />
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
              id="update-wilaya-form"
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
            <Button className="border-1 cursor-pointer w-36 p-5 ml-auto" type="submit" form="update-wilaya-form">
              {commonTranslation("apply")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
