import { Card, CardContent } from "@/components/ui/card";
import { Visit } from "@/schemas/visit/visit.schema";
import { format } from "date-fns";

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    planifiée: "text-blue-600",
    effectuée: "text-emerald-600",
    annulée: "text-red-600",
  };
  return colors[status];
}

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    planifiée: "● Planifiée",
    effectuée: "● Effectuée",
    annulée: "● Annulée",
  };
  return labels[status];
}

interface Props {
  visit: Visit;
}
export default function VisitCard({ visit }: { visit: Visit }) {
  return (
    <Card className="bg-transparent my-2">
      <CardContent className="grid grid-cols-2">
        {/* Left Column */}
        <div className="space-y-3">
          <div>
            <div className="text-xs text-gray-500 mb-1">ID de l'offre</div>
            <div className="text-sm font-medium text-gray-900">#{visit.offer_id}</div>
          </div>

          <div>
            <div className="text-xs text-gray-500 mb-1">Bien visité</div>
            <div className="text-sm font-medium text-gray-900">{visit.bien}</div>
          </div>

          <div>
            <div className="text-xs text-gray-500 mb-1">Agent responsable de la visite</div>
            <div className="text-sm font-medium text-gray-900">{visit.agent}</div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-3">
          <div>
            <div className="text-xs text-gray-500 mb-1">Date et heure de la visite</div>
            <div className="text-sm font-medium text-gray-900">{format(visit.created_at, "dd/MM/yyyy à HH:mm")}</div>
          </div>

          <div>
            <div className="text-xs text-gray-500 mb-1">Statut de la visite</div>
            <div className={`text-sm font-medium ${getStatusColor(visit.status)}`}>{getStatusLabel(visit.status)}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
