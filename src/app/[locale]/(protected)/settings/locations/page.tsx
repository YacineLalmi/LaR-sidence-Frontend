import WilayaView from "./_components/wilayas/wilaya-view";
import CommuneView from "./_components/communes/commune-view";

export default async function Location({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const queryParams = await searchParams;

  return (
    <div className="grid grid-cols-2 gap-[32px]">
      <WilayaView searchParams={queryParams} />
      <CommuneView searchParams={queryParams} />
    </div>
  );
}
