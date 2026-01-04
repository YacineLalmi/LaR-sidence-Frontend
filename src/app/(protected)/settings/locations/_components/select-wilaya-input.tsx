"use client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ListItem } from "@/schemas/Global.schema";
import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";

interface Props {
  wilayas: ListItem[];
  selectedWilayaId: string;
}
export default function SelectWilayaInput({ wilayas, selectedWilayaId }: Props) {
  const router = useRouter();

  const handleWilayaChange = useCallback((wilaya_id: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set("wilaya_id", wilaya_id);
    params.set("communes_page", "1");
    router.push(`?${params.toString()}`);
  }, []);

  return (
    <div className="w-full">
      <Select onValueChange={handleWilayaChange} defaultValue={selectedWilayaId}>
        <SelectTrigger className="w-2/3 py-6 rounded-4xl">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {wilayas.length > 0
            ? wilayas.map((wilaya) => (
                <SelectItem key={wilaya.id} value={wilaya.id}>
                  {wilaya.name}
                </SelectItem>
              ))
            : "no options"}
        </SelectContent>
      </Select>
    </div>
  );
}
