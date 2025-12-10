import React from "react";

import { ColorService } from "@/services/colors.service";
import CreateOfferStatusForm from "./_components/create-form";

export default async function CreateClientStatusPage() {

  const colors = await ColorService.list()
  
  return <CreateOfferStatusForm colors={colors}/>;
}
