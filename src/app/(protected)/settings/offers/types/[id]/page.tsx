import React from "react";

import UpdateOfferTypeForm from "./_components/update-form";
import { OfferTypeService } from "@/services/offer-types.service";

export default async function UpdateClientStatusPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const offerType = await OfferTypeService.findOne(id);

  return <UpdateOfferTypeForm offerType={offerType} />;
}
