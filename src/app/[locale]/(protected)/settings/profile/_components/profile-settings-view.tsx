"use client";

import { changeProfilePasswordAction } from "@/actions/Profile/change-profile-password.action";
import { updateProfileAction } from "@/actions/Profile/update-profile.action";
import { setLocaleAction } from "@/actions/i18n/set-locale.action";
import InputPasswordField from "@/components/custom-inputs/input-password-field";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { getUserInitials, getUserRoleLabel } from "@/lib/user-display";
import { customToast } from "@/lib/utils";
import { PasswordResetForm, PasswordResetFormSchema } from "@/schemas/profile/PasswordReset.schema";
import { ProfileForm, ProfileFormSchema } from "@/schemas/users/profile-form.schema";
import { User } from "@/schemas/users/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Globe, KeyRound } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { useForm } from "react-hook-form";

const ACCENT = "#C5A36F";
const CREAM = "#F9F7F2";

type Props = {
  initialUser: User;
};

export default function ProfileSettingsView({ initialUser }: Props) {
  const translation = useTranslations();
  const router = useRouter();
  const locale = useLocale();
  const [editing, setEditing] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [localeBusy, setLocaleBusy] = useState(false);

  const defaultValues = useMemo<ProfileForm>(
    () => ({
      first_name: initialUser.first_name,
      last_name: initialUser.last_name,
      username: initialUser.username,
      phonenumber: initialUser.phonenumber ?? "",
      email: initialUser.email,
    }),
    [initialUser],
  );

  const form = useForm<ProfileForm>({
    resolver: zodResolver(ProfileFormSchema),
    defaultValues,
  });

  useEffect(() => {
    if (!editing) {
      form.reset(defaultValues);
    }
  }, [defaultValues, editing, form]);

  const passwordForm = useForm<PasswordResetForm>({
    resolver: zodResolver(PasswordResetFormSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      new_password_confirmation: "",
    },
  });

  const onSave = useCallback(
    (values: ProfileForm) => {
      startTransition(async () => {
        const res = await updateProfileAction(values);
        if (res.isOk) {
          customToast.success(translation(TRANSLATIONS_KEYS_2.SETTINGS.PROFILE.MESSAGES.PROFILE_UPDATED));
          setEditing(false);
          router.refresh();
        } else {
          customToast.error(
            res.errorMessage || translation(TRANSLATIONS_KEYS_2.SETTINGS.PROFILE.MESSAGES.UPDATE_FAILED),
          );
        }
      });
    },
    [router, translation],
  );

  const onPasswordSubmit = useCallback(
    (values: PasswordResetForm) => {
      startTransition(async () => {
        const res = await changeProfilePasswordAction(values);
        if (res.isOk) {
          customToast.success(translation(TRANSLATIONS_KEYS_2.SETTINGS.PROFILE.MESSAGES.PASSWORD_CHANGED));
          setPasswordOpen(false);
          passwordForm.reset();
        } else {
          customToast.error(
            res.errorMessage || translation(TRANSLATIONS_KEYS_2.SETTINGS.PROFILE.MESSAGES.PASSWORD_CHANGE_FAILED),
          );
        }
      });
    },
    [passwordForm, translation],
  );

  const toggleLocale = useCallback(async () => {
    const next = locale === "fr" ? "en" : "fr";
    setLocaleBusy(true);
    try {
      await setLocaleAction(next);
      router.refresh();
    } finally {
      setLocaleBusy(false);
    }
  }, [locale, router]);

  return (
    <div
      className="rounded-[24px] border border-black/5 px-4 py-6 sm:px-8 sm:py-8 shadow-sm md:px-10"
      style={{ backgroundColor: CREAM }}
    >
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-black md:text-3xl">
          {translation(TRANSLATIONS_KEYS_2.SETTINGS.PROFILE.PAGE_TITLE)}
        </h1>
        <div className="flex gap-2">
          {editing ? (
            <>
              <Button
                type="button"
                variant="outline"
                className="rounded-full border-black/20"
                onClick={() => {
                  form.reset(defaultValues);
                  setEditing(false);
                }}
                disabled={pending}
              >
                {translation(TRANSLATIONS_KEYS_2.SETTINGS.PROFILE.BUTTONS.CANCEL)}
              </Button>
              <Button
                type="button"
                className="rounded-full bg-black px-6 text-white hover:bg-black/90"
                disabled={pending}
                onClick={() => form.handleSubmit(onSave)()}
              >
                {translation(TRANSLATIONS_KEYS_2.SETTINGS.PROFILE.BUTTONS.SAVE)}
              </Button>
            </>
          ) : (
            <Button
              type="button"
              className="rounded-full bg-black px-8 text-white hover:bg-black/90"
              onClick={() => setEditing(true)}
            >
              {translation(TRANSLATIONS_KEYS_2.SETTINGS.PROFILE.BUTTONS.EDIT)}
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
        <div className="flex flex-col items-center gap-2 lg:items-start">
          <Avatar className="h-28 w-28 border border-black/10 shadow-sm">
            <AvatarFallback className="bg-black text-xl font-medium text-white">
              {getUserInitials(initialUser)}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium" style={{ color: ACCENT }}>
            {getUserRoleLabel(initialUser)}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <Form {...form}>
            <form className="grid grid-cols-1 gap-x-10 gap-y-5 md:grid-cols-2">
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-black/80">
                      {translation(TRANSLATIONS_KEYS_2.SETTINGS.PROFILE.FIELDS.LAST_NAME)}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={!editing || pending}
                        className="rounded-2xl border-black/10 bg-white/80"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-2">
                <FormLabel className="text-sm font-medium text-black/40">
                  {translation(TRANSLATIONS_KEYS_2.SETTINGS.PROFILE.FIELDS.ADDRESS)}
                </FormLabel>
                <Input
                  disabled
                  readOnly
                  placeholder={translation(TRANSLATIONS_KEYS_2.SETTINGS.PROFILE.PLACEHOLDERS.ADDRESS)}
                  className="rounded-2xl border-black/10 bg-black/[0.03] text-black/40"
                />
                <p className="text-xs text-black/40">
                  {translation(TRANSLATIONS_KEYS_2.SETTINGS.PROFILE.HINTS.ADDRESS_FIELDS)}
                </p>
              </div>
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-black/80">
                      {translation(TRANSLATIONS_KEYS_2.SETTINGS.PROFILE.FIELDS.FIRST_NAME)}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={!editing || pending}
                        className="rounded-2xl border-black/10 bg-white/80"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-2">
                <FormLabel className="text-sm font-medium text-black/40">
                  {translation(TRANSLATIONS_KEYS_2.SETTINGS.PROFILE.FIELDS.CITY)}
                </FormLabel>
                <Input
                  disabled
                  readOnly
                  placeholder={translation(TRANSLATIONS_KEYS_2.SETTINGS.PROFILE.PLACEHOLDERS.CITY)}
                  className="rounded-2xl border-black/10 bg-black/[0.03] text-black/40"
                />
              </div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-black/80">
                      {translation(TRANSLATIONS_KEYS_2.SETTINGS.PROFILE.FIELDS.EMAIL)}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        disabled={!editing || pending}
                        className="rounded-2xl border-black/10 bg-white/80"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-2">
                <FormLabel className="text-sm font-medium text-black/40">
                  {translation(TRANSLATIONS_KEYS_2.SETTINGS.PROFILE.FIELDS.POSTAL_CODE)}
                </FormLabel>
                <Input
                  disabled
                  readOnly
                  placeholder={translation(TRANSLATIONS_KEYS_2.SETTINGS.PROFILE.PLACEHOLDERS.POSTAL_CODE)}
                  className="rounded-2xl border-black/10 bg-black/[0.03] text-black/40"
                />
              </div>
              <FormField
                control={form.control}
                name="phonenumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-black/80">
                      {translation(TRANSLATIONS_KEYS_2.SETTINGS.PROFILE.FIELDS.PHONE)}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={!editing || pending}
                        className="rounded-2xl border-black/10 bg-white/80"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="hidden min-h-[1px] md:block" aria-hidden />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-black/80">
                      {translation(TRANSLATIONS_KEYS_2.SETTINGS.PROFILE.FIELDS.USERNAME)}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={!editing || pending}
                        className="rounded-2xl border-black/10 bg-white/80"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-black">
            {translation(TRANSLATIONS_KEYS_2.SETTINGS.PROFILE.SECTIONS.ACCOUNT_SECURITY)}
          </h2>
          <button
            type="button"
            onClick={() => setPasswordOpen(true)}
            className="flex w-full items-center gap-3 rounded-2xl border border-black/10 bg-white/90 px-4 py-4 text-left text-sm font-medium text-black shadow-sm transition hover:bg-white"
          >
            <KeyRound className="h-5 w-5 shrink-0 opacity-70" />
            {translation(TRANSLATIONS_KEYS_2.SETTINGS.PROFILE.SECTIONS.CHANGE_PASSWORD)}
          </button>
        </div>
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-black">
            {translation(TRANSLATIONS_KEYS_2.SETTINGS.PROFILE.SECTIONS.DISPLAY_ACCESSIBILITY)}
          </h2>
          <button
            type="button"
            onClick={toggleLocale}
            disabled={localeBusy}
            className="flex w-full items-center justify-between gap-3 rounded-2xl border border-black/10 bg-white/90 px-4 py-4 text-left text-sm font-medium text-black shadow-sm transition hover:bg-white disabled:opacity-60"
          >
            <span className="flex items-center gap-3">
              <Globe className="h-5 w-5 shrink-0 opacity-70" />
              {translation(TRANSLATIONS_KEYS_2.SETTINGS.PROFILE.SECTIONS.LANGUAGE)}
            </span>
            <span className="rounded-full bg-black/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              {locale === "fr" ? "FR" : "EN"}
            </span>
          </button>
        </div>
      </div>

      <Dialog open={passwordOpen} onOpenChange={setPasswordOpen}>
        <DialogContent className="rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{translation(TRANSLATIONS_KEYS_2.SETTINGS.PROFILE.PASSWORD_DIALOG.TITLE)}</DialogTitle>
            <DialogDescription>
              {translation(TRANSLATIONS_KEYS_2.SETTINGS.PROFILE.PASSWORD_DIALOG.DESCRIPTION)}
            </DialogDescription>
          </DialogHeader>
          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
              <InputPasswordField
                control={passwordForm.control}
                name="current_password"
                label={translation(TRANSLATIONS_KEYS_2.SETTINGS.PROFILE.FORM.LABEL.CURRENT_PASSWORD)}
                placeholder={translation(TRANSLATIONS_KEYS_2.SETTINGS.PROFILE.FORM.PLACEHOLDER.CURRENT_PASSWORD)}
                required
                disabled={pending}
              />
              <InputPasswordField
                control={passwordForm.control}
                name="new_password"
                label={translation(TRANSLATIONS_KEYS_2.SETTINGS.PROFILE.FORM.LABEL.NEW_PASSWORD)}
                placeholder={translation(TRANSLATIONS_KEYS_2.SETTINGS.PROFILE.FORM.PLACEHOLDER.NEW_PASSWORD)}
                required
                disabled={pending}
              />
              <InputPasswordField
                control={passwordForm.control}
                name="new_password_confirmation"
                label={translation(TRANSLATIONS_KEYS_2.SETTINGS.PROFILE.FORM.LABEL.CONFIRM_NEW_PASSWORD)}
                placeholder={translation(TRANSLATIONS_KEYS_2.SETTINGS.PROFILE.FORM.PLACEHOLDER.CONFIRM_NEW_PASSWORD)}
                required
                disabled={pending}
              />
              <DialogFooter className="gap-2 sm:gap-0">
                <Button type="button" variant="outline" onClick={() => setPasswordOpen(false)} className="rounded-full">
                  {translation(TRANSLATIONS_KEYS_2.SETTINGS.PROFILE.BUTTONS.CANCEL)}
                </Button>
                <Button type="submit" className="rounded-full bg-black text-white" disabled={pending}>
                  {translation(TRANSLATIONS_KEYS_2.SETTINGS.PROFILE.PASSWORD_DIALOG.SUBMIT)}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
