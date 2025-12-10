import React from "react";
import { BienTypeService } from "@/services/BienType.service";
import UpdateBienTypeForm from "./_components/update-form";

export default async function page({ params }: { params: Promise<{ id: string }> }) {
  const id = parseInt((await params).id);
  const BienType = await BienTypeService.findOne(id);
  return (
    <div>
      <UpdateBienTypeForm bienType={BienType} />
    </div>
  );
}
