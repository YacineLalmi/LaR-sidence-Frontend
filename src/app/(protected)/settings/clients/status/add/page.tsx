import React from "react";

import { ColorService } from "@/services/colors.service";
import CreateClientStatusForm from "./_components/create-form";

export default async function CreateClientStatusPage() {

  const colors = await ColorService.list()
  
  return <CreateClientStatusForm colors={colors}/>;
}
