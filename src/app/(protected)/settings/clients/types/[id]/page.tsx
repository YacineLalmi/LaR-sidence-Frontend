import React from "react";

import UpdateClientTypeForm from "./_components/update-form";
import { ClientTypeService } from "@/services/client-types.service";

export default async function UpdateClientStatusPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const clientType = await ClientTypeService.findOne(id);

  return <UpdateClientTypeForm clientType={clientType} />;
}
