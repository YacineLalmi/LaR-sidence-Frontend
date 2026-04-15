import { Card, CardContent } from "@/components/ui/card";
import { formatMoney } from "@/lib/utils";
import { Price } from "@/schemas/price/price.schema";
import { format } from "date-fns";

interface Props {
  price: Price;
}
export default function PriceCard({ price }: Props) {
  return (
    <Card className="bg-transparent my-2">
      <CardContent className="grid grid-cols-2">
        {/* Left Column */}
        <div className="space-y-3">
          <div>
            <div className="text-xs text-gray-500 mb-1">Date de changement</div>
            <div className="text-sm font-medium text-gray-900">{format(price.created_at, "dd/MM/yyyy")}</div>
          </div>

          <div>
            <div className="text-xs text-gray-500 mb-1">Ancien prix</div>
            <div className="text-sm font-medium text-gray-900">{formatMoney(price.old_price)}</div>
          </div>

          <div>
            <div className="text-xs text-gray-500 mb-1">Commentaire</div>
            <div className="text-sm font-medium text-gray-900">{price.comment}</div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-3">
          <div>
            <div className="text-xs text-gray-500 mb-1">Date de creation du bien</div>
            <div className="text-sm font-medium text-gray-900">{format(price.bien_creation_date, "dd/MM/yyyy")}</div>
          </div>

          <div>
            <div className="text-xs text-gray-500 mb-1">Ancien prix</div>
            <div className="text-sm font-medium text-gray-900">{formatMoney(price.old_price)}</div>
          </div>

          <div>
            <div className="text-xs text-gray-500 mb-1">Modifier par</div>
            <div className="text-sm font-medium text-gray-900">{price.user}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
