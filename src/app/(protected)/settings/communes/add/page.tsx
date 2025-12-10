import { WilayasService } from "@/services/wilayas.service";
import CreateCommuneForm from "./create-commune";

export default async function AjouterCommunePage() {
  const wilayas = await WilayasService.list();
  return <CreateCommuneForm wilayas={wilayas} />;
}
