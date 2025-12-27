"use client";

import { Demand } from "@/schemas/demands/demand.schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Edit, Printer } from "lucide-react";

interface Props {
  demand: Demand;
}

export default function DemandDetailView({ demand }: Props) {
  const t = useTranslations();

  const formatBudget = (budget: number | string | null | undefined) => {
    if (!budget) return "-";
    const numBudget = typeof budget === 'string' ? parseFloat(budget) : budget;
    return new Intl.NumberFormat('fr-DZ', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numBudget) + " Da";
  };

  const formatDate = (date: string | null | undefined) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("fr-FR");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>
            {t("demands.detail.demandId")}: #{demand.id?.toString().padStart(6, '0')}
          </CardTitle>
          <div className="flex gap-2">
            <Link href={`/demands/${demand.id}/edit`}>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                {t("demands.actions.edit")}
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              <Printer className="h-4 w-4 mr-2" />
              {t("demands.actions.print")}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">{t("demands.form.label.type")}</label>
            <p className="text-base">{demand.type?.name || "-"}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">{t("demands.form.label.client")}</label>
            <p className="text-base">
              {demand.client
                ? `${demand.client.first_name || ""} ${demand.client.last_name || ""}`.trim() || "-"
                : "-"}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">{t("demands.form.label.bien")}</label>
            <p className="text-base">{demand.bien?.title || "-"}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">{t("demands.form.label.status")}</label>
            <p className="text-base">{demand.status?.name || "-"}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">{t("demands.form.label.budget")}</label>
            <p className="text-base">{formatBudget(demand.budget)}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">{t("demands.form.label.priority")}</label>
            <p className="text-base">{demand.priority?.name || "-"}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">{t("demands.form.label.agent")}</label>
            <p className="text-base">
              {demand.agent
                ? `${demand.agent.first_name || ""} ${demand.agent.last_name || ""}`.trim() || "-"
                : "-"}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">{t("demands.form.label.source")}</label>
            <p className="text-base">{demand.source?.name || "-"}</p>
          </div>
        </div>
        {demand.comment && (
          <div>
            <label className="text-sm font-medium text-gray-500">
              {t("demands.form.sections.internalComments")}
            </label>
            <p className="text-base mt-2 whitespace-pre-wrap">{demand.comment}</p>
          </div>
        )}
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
          <div>
            <label>{t("demands.detail.createdAt")}:</label> {formatDate(demand.created_at)}
          </div>
          {demand.updated_at && (
            <div>
              <label>{t("demands.detail.updatedAt")}:</label> {formatDate(demand.updated_at)}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

