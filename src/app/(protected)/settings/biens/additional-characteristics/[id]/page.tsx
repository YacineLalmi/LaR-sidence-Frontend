import React from "react";

import UpdateBienAdditionalcharacteristicsForm from "./_components/update-form";
import { BienAdditionalcharacteristicsService } from "@/services/bien-additional-charactiristics.service";

export default async function page({ params }: { params: Promise<{ id: string }> }) {
  const id = parseInt((await params).id);
  const bienAdditionalcharacteristics = await BienAdditionalcharacteristicsService.findOne(id);
  return (
    <div>
      <UpdateBienAdditionalcharacteristicsForm bienAdditionalcharacteristics={bienAdditionalcharacteristics} />
    </div>
  );
}
