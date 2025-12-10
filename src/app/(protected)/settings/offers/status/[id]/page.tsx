import React from "react";
import { ColorService } from "@/services/colors.service";
import UpdateOfferStatusForm from "./_components/update-form";
import { OfferStatusService } from "@/services/offer-status.service";

export default async function UpdateOfferStatusPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const colors = await ColorService.list();
  const offerStatus = await OfferStatusService.findOne(id);

  return <UpdateOfferStatusForm colors={colors} offerStatus={offerStatus} />;
}
