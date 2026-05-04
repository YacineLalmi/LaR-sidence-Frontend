import getBienStatsActions from "@/actions/dashboard/get-bien-stats.action";
import { StatCard } from "./_components/stat-card";
import getDemandStatsActions from "@/actions/dashboard/get-demand-stats.action";
import getOfferStatsActions from "@/actions/dashboard/get-offer-stats.action";
import { EventCard } from "./_components/event-card";
import { NotificationsCard } from "./_components/notifications-card";
import { CarouselCard } from "./_components/carousel-card";

export default function TableauDeBord() {
  return (
    <div className="grid grid-cols-9 grid-rows-[165px_1fr] gap-4 h-full">
      {/* First Row: col-span-2, row-span-1 (since it's only 100px tall now) */}
      <div className="col-span-2">
        <StatCard action={getBienStatsActions} title="Bien Totaux" />
      </div>
      <div className="col-span-2">
        <StatCard action={getDemandStatsActions} title="Demandes à traiter" />
      </div>
      <div className="col-span-2">
        <StatCard action={getOfferStatsActions} title="Offres actives" />
      </div>
      <div className="col-span-3">
        <EventCard />
      </div>

      {/* Second Row: takes the remaining '1fr' space */}
      <div className="col-span-5 min-h-0">
        {/* min-h-0 is CRITICAL for charts to not overflow their container */}
        <CarouselCard />
      </div>
      <div className="col-span-4 min-h-0">
        <NotificationsCard />
      </div>
    </div>
  );
}
