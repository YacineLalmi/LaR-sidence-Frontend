import { WilayaService } from "@/services/wilaya.service";
import CreateCommuneForm from "./create-commune";

export default async function AjouterCommunePage() {
  const wilayas = await WilayaService.list();
  return <CreateCommuneForm wilayas={wilayas} />;
}
