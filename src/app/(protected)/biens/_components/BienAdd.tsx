"use client";
import { createBienAction, CreateBienState } from "@/actions/Bien/create.action";
import { createBienTypeAction, CreateBienTypeState } from "@/actions/BienTypes/create.action";
import CustomInput from "@/components/custom-input/custom-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { customToast } from "@/lib/utils";
import { BienStatus } from "@/schemas/BienStatus.schema";
import { BienTransaction } from "@/schemas/BienTransaction.schema";
import { BienType } from "@/schemas/BienType.schema";
import React, { useActionState, useCallback, useEffect, useState } from "react";

interface Props {
  types: BienType[];
  transactions: BienTransaction[];
  status: BienStatus[];
}

export default function BienAdd({ types, transactions, status }: Props) {
  const initalState: CreateBienState = {
    isOk: "UNDEFINED",
    title: "",
    adresse: "",
    wilaya: "",
    commune: "",
    habitable_surface: 0,
    total_surface: 0,
    peices: 0,
    rooms: 0,
    price: 0,
    exclusivity: false,
    exclusivity_start: new Date(),
    exclusivity_end: new Date(),
    responsible_agent: "",
  };
  const [state, formAction, isPending] = useActionState(createBienAction, initalState);

  useEffect(() => {
    if (state.isOk === "NOK") {
      customToast.error(state.errorMessage || "");
    } else if (state.isOk === "OK") {
      customToast.success("Bien Type successfully added");
    }
  }, [state]);

  return (
    <Card className="bg-transparent shadow-none border-none">
      <CardHeader>
        <h2>Ajouter un Type de bien</h2>
      </CardHeader>
      <CardContent>
        <form className="grid grid-cols-2 gap-5" action={formAction} id="bien-type-create-form">
          <CustomInput
            label="Titre"
            id="title"
            value={state.title}
            name="title"
            placeholder="Titre du bien"
            disabled={isPending}
            required
            error={state.errorDetails?.title}
          />

          <CustomInput
            label="Adresse"
            id="adresse"
            value={state.adresse}
            name="adresse"
            placeholder="Adresse"
            disabled={isPending}
            required
            error={state.errorDetails?.adresse}
          />

          <CustomInput
            label="Wilaya"
            id="wilaya"
            value={state.wilaya}
            name="wilaya"
            placeholder="Wilaya"
            disabled={isPending}
            required
            error={state.errorDetails?.wilaya}
          />

          <CustomInput
            label="Commune"
            id="commune"
            value={state.commune}
            name="commune"
            placeholder="Commune"
            disabled={isPending}
            required
            error={state.errorDetails?.commune}
          />

          <CustomInput
            label="Surface Habitable"
            id="habitable_surface"
            type="number"
            value={state.habitable_surface}
            name="habitable_surface"
            placeholder="Surface habitable (m²)"
            disabled={isPending}
            required
            error={state.errorDetails?.habitable_surface}
          />

          <CustomInput
            label="Surface Totale"
            id="total_surface"
            type="number"
            value={state.total_surface}
            name="total_surface"
            placeholder="Surface totale (m²)"
            disabled={isPending}
            required
            error={state.errorDetails?.total_surface}
          />

          <CustomInput
            label="Nombre de Pièces"
            id="peices"
            type="number"
            value={state.peices}
            name="peices"
            placeholder="Nombre de pièces"
            disabled={isPending}
            required
            error={state.errorDetails?.peices}
          />

          <CustomInput
            label="Nombre de Chambres"
            id="rooms"
            type="number"
            value={state.rooms}
            name="rooms"
            placeholder="Nombre de chambres"
            disabled={isPending}
            required
            error={state.errorDetails?.rooms}
          />

          <CustomInput
            label="Prix"
            id="price"
            type="number"
            value={state.price}
            name="price"
            placeholder="Prix"
            disabled={isPending}
            required
            error={state.errorDetails?.price}
          />

          <CustomInput
            label="Exclusivité"
            id="exclusivity"
            type="checkbox"
            checked={state.exclusivity}
            name="exclusivity"
            disabled={isPending}
            error={state.errorDetails?.exclusivity}
          />

          <CustomInput
            label="Début d'exclusivité"
            id="exclusivity_start"
            type="text"
            value={state.exclusivity_start?.toISOString()}
            name="exclusivity_start"
            disabled={isPending}
            error={state.errorDetails?.exclusivity_start}
          />

          <CustomInput
            label="Fin d'exclusivité"
            id="exclusivity_end"
            type="text"
            value={state.exclusivity_end?.toISOString()}
            name="exclusivity_end"
            disabled={isPending}
            error={state.errorDetails?.exclusivity_end}
          />

          <CustomInput
            label="Agent Responsable"
            id="responsible_agent"
            value={state.responsible_agent}
            name="responsible_agent"
            placeholder="ID de l'agent responsable"
            disabled={isPending}
            required
            error={state.errorDetails?.responsible_agent}
          />
          <CustomInput
            type="select"
            id="wilaya"
            name="wilaya"
            label="Wilaya"
            value={state.wilaya}
            disabled={isPending}
            required
            selectOptions={[
              { label: "Alger", value: "alger" },
              { label: "Oran", value: "oran" },
              { label: "Constantine", value: "constantine" },
            ]}
            error={state.errorDetails?.wilaya}
          />

          <CustomInput
            type="select"
            id="types"
            name="types"
            label="types"
            value={1}
            disabled={isPending}
            required
            selectOptions={types.map((type) => ({ label: type.name, value: type.id }))}
            error={state.errorDetails?.wilaya}
          />

          <CustomInput
            type="select"
            id="transactions"
            name="transactions"
            label="transactions"
            value={1}
            disabled={isPending}
            required
            selectOptions={transactions.map((transaction) => ({ label: transaction.name, value: transaction.id }))}
            error={state.errorDetails?.wilaya}
          />

          <CustomInput
            type="select"
            id="status"
            name="status"
            label="status"
            value={1}
            disabled={isPending}
            required
            selectOptions={status.map((status) => ({ label: status.name, value: status.id }))}
            error={state.errorDetails?.wilaya}
          />
        </form>
      </CardContent>
      <CardFooter className="w-full justify-end">
        <Button className="border-1 cursor-pointer w-52 p-5" type="submit" form="bien-type-create-form">
          Sauvegarder
        </Button>
      </CardFooter>
    </Card>
  );
}
