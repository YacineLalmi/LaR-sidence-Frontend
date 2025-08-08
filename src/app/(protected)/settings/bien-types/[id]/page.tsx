import React from "react";
import BienTypeUpdate from "../_components/BienTypeUpdate";
import { BienTypeService } from "@/services/BienType.service";

export default async function page({ params }: { params: Promise<{ id: string }> }) {
  const id = parseInt((await params).id);
  const BienType = await BienTypeService.findOne(id);
  return (
    <div>
      <BienTypeUpdate item={BienType} />
    </div>
  );
}
