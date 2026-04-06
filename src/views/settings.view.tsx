import { Card, CardContent, CardHeader } from "@/components/ui/card";
import NavigationButton from "@/components/ui/navigation-button";
import { ROUTES } from "@/constants/routes";
import { ForbiddenError } from "@/lib/errors";
import { ShieldAlert, AlertCircle } from "lucide-react";

interface Props {
  title: string;
  searchField: React.ReactNode;
  createComponent?: React.ReactNode;
  children: React.ReactNode;
  error?: any;
  backLink?: string; // New optional prop
}

export default function SettingsView({ title, searchField, createComponent, children, error, backLink }: Props) {
  // Helper to render the header consistently
  const renderHeader = () => (
    <CardHeader className="px-0 flex flex-col gap-4">
      {backLink ? (
        <NavigationButton title={title} backLink={backLink} />
      ) : (
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      )}

      <div className="flex w-full justify-between gap-2 items-center">
        {searchField}
        {createComponent}
      </div>
    </CardHeader>
  );

  // 1. Handle Forbidden Error (403)
  if (error instanceof ForbiddenError || error?.status === 403) {
    return (
      <Card className="bg-transparent border-none shadow-none p-0">
        {renderHeader()}
        <CardContent className="flex flex-col items-center justify-center p-10 text-center border-destructive bg-destructive/5 rounded-2xl">
          <ShieldAlert className="h-12 w-12 text-destructive mb-4" />
          <h2 className="text-xl font-semibold text-destructive">Accès Refusé</h2>
          <p className="text-muted-foreground mt-2 max-w-[400px]">
            Vous n'avez pas les permissions nécessaires pour consulter ces données.
          </p>
        </CardContent>
      </Card>
    );
  }

  // 2. Handle Generic Server Error
  if (error) {
    return (
      <Card className="border-orange-500/50 bg-orange-500/5 mt-4">
        <CardContent className="flex flex-col items-center justify-center p-10 text-center">
          <AlertCircle className="h-12 w-12 text-orange-500 mb-4" />
          <h2 className="text-xl font-semibold">Erreur de chargement</h2>
          <p className="text-muted-foreground mt-2">Une erreur est survenue lors de la récupération des données.</p>
        </CardContent>
      </Card>
    );
  }

  // 3. Normal Render
  return (
    <Card className="bg-transparent border-none shadow-none p-0">
      {renderHeader()}
      <CardContent className="px-0">{children}</CardContent>
    </Card>
  );
}
