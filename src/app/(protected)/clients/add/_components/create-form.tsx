"use client";

import { createClientAction } from "@/actions/clients/create.action";
import Section from "@/app/(protected)/biens/add/_components/section";
import { InputFileLarge } from "@/components/custom-inputs/input-file-large";
import InputSelectField from "@/components/custom-inputs/input-select";
import InputTextField from "@/components/custom-inputs/input-text";
import InputTextArea from "@/components/custom-inputs/input-textarea";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { customToast } from "@/lib/utils";
import { ClientForm, ClientFormSchema } from "@/schemas/clients/client-form.schema";
import { ListItem } from "@/schemas/Global.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

interface Props {
  types: ListItem[];
  status: ListItem[];
  sources: ListItem[];
  genders: ListItem[];
}
export default function CreateClientForm({ types, status, sources, genders }: Props) {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>([]);

  const router = useRouter();
  const t = useTranslations();

  const form = useForm<ClientForm>({
    resolver: zodResolver(ClientFormSchema),
    defaultValues: {
      gender: undefined,
      last_name: "",
      first_name: "",
      source_id: undefined,
      email: "",
      phone_numbers: [{ countryCode: "213", phoneNumber: "" }],
      documents: [],
      test: [""],
      comment: "",
      status_id: undefined,
      type_id: undefined,
    },
  });

  // Inside your component
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "phone_numbers",
    rules: {
      minLength: 1,
      maxLength: 4,
    },
  });

  async function onSubmit(values: ClientForm) {
    console.log(values)
    setIsPending(true);
    try {
      const response = await createClientAction(values);
      setIsPending(false);
      if (response.isOk) {
        router.push("/clients");
        customToast.success(t("common.success.operationcompleted"));
      } else customToast.error(response.errorMessage || t("common.errors.somethingwrong"));
    } catch (error) {
      console.log(error);
      customToast.error(t("common.errors.somethingwrong"));
    }
  }

  async function onInvalid(values: any) {
    const [field, error] = Object.entries(values)[0] as [string, { message: string }];
    customToast.error(`${field}: ${error.message}`);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-8 grid grid-cols-2 gap-5">
        <div className="grid grid-cols-1 gap-3">
          <Section header="Information Générale">
            <InputSelectField
              control={form.control}
              name="gender"
              label={t("clients.form.label.gender")}
              options={genders}
              placeholder={t("clients.form.placeholder.gender")}
              disabled={isPending}
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <InputTextField
                control={form.control}
                name="first_name"
                label={t("clients.form.label.firstName")}
                disabled={isPending}
                required
                placeholder={t("clients.form.placeholder.firstName")}
              />
              <InputTextField
                control={form.control}
                name="last_name"
                label={t("clients.form.label.lastName")}
                disabled={isPending}
                required
                placeholder={t("clients.form.placeholder.lastName")}
              />
            </div>

            <InputTextField
              control={form.control}
              name="email"
              label={t("clients.form.label.email")}
              disabled={isPending}
              required
              placeholder={t("clients.form.placeholder.email")}
            />
            <div className="grid grid-cols-2 gap-3 items-end">
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-start">
                  <InputTextField
                    control={form.control}
                    name={`phone_numbers.${index}.phoneNumber`}
                    label={`${t("clients.form.label.phoneNumber")}  0${index}`}
                    placeholder={t("clients.form.placeholder.phoneNumber")}
                    RightIcon={Trash2}
                    RightIconOnClick={() => remove(index)}
                    disabled={isPending}
                  />
                </div>
              ))}
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={() =>
                  append({
                    countryCode: "213",
                    phoneNumber: "",
                  })
                }
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-2" />
              </Button>
            </div>
            <InputTextArea
              control={form.control}
              name="comment"
              label={t("clients.form.label.comment")}
              disabled={isPending}
              required
              placeholder={t("clients.form.placeholder.comment")}
            />
          </Section>
        </div>
        <div>
          <Section header="Docmuments">
            <InputFileLarge />
            <InputSelectField
              control={form.control}
              name="source_id"
              options={sources}
              label={t("clients.form.label.source")}
              disabled={isPending}
              required
              placeholder={t("clients.form.placeholder.source")}
            />
            <InputSelectField
              control={form.control}
              name="type_id"
              options={sources}
              label={t("clients.form.label.type")}
              disabled={isPending}
              required
              placeholder={t("clients.form.placeholder.type")}
            />
            <InputSelectField
              control={form.control}
              name="status_id"
              options={types}
              label={t("clients.form.label.status")}
              disabled={isPending}
              required
              placeholder={t("clients.form.placeholder.status")}
            />
          </Section>
        </div>
        <Button className="border-1 cursor-pointer w-52 p-5 col-span-3 ml-auto" type="submit">
          {t("common.submit")}
        </Button>
      </form>
    </Form>
  );
}
