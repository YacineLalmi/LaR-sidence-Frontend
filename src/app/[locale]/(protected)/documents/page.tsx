import { getTranslations } from "next-intl/server";
import { getProfilePermissionsAction } from "@/actions/Profile/get-profile-permissions.action";
import { PERMISSIONS } from "@/constants/permissions";
import { ListItem } from "@/schemas/global.schema";
import { DocumentService } from "@/services/document.service";
import { UserService } from "@/services/user.service";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Suspense } from "react";
import DocumentsView from "./_components/documents-view";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";

function mergeAgentLists(library: ListItem[], fallback: ListItem[]): ListItem[] {
  const byId = new Map<string, ListItem>();
  for (const item of library) {
    byId.set(String(item.id), item);
  }
  for (const item of fallback) {
    if (!byId.has(String(item.id))) {
      byId.set(String(item.id), item);
    }
  }
  return Array.from(byId.values()).sort((a, b) => a.name.localeCompare(b.name, "fr", { sensitivity: "base" }));
}

export default async function DocumentsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const query: Record<string, string> = {};
  if (params.search) query.search = params.search;
  if (params.page) query.page = params.page;
  if (params.sort) query.sort = params.sort;
  if (params.type) query.type = params.type;
  else if (params["filter[type]"]) query.type = params["filter[type]"];
  if (params.uploaded_by) query.uploaded_by = params.uploaded_by;
  if (params.on_day) query.on_day = params.on_day;
  if (params["filter[source]"]) query.source = params["filter[source]"];
  if (params.folder) query.folder_id = params.folder;

  const permissions = await getProfilePermissionsAction();
  const canViewDocuments = permissions.includes(PERMISSIONS.VIEW_DOCUMENTS);
  const canManageDocuments = permissions.includes(PERMISSIONS.MANAGE_DOCUMENTS);
  const canViewConfidentialDocuments = permissions.includes(PERMISSIONS.VIEW_CONFIDENTIAL_DOCUMENTS);

  const [files, folders, libraryUploaders, agentsFallback] = await Promise.all([
    DocumentService.findMany(query),
    canViewDocuments ? DocumentService.listFolders().catch(() => []) : Promise.resolve([]),
    canViewDocuments ? DocumentService.listLibraryUploaders().catch(() => []) : Promise.resolve([]),
    canViewDocuments ? UserService.agentList("").catch(() => []) : Promise.resolve([]),
  ]);

  const agents = mergeAgentLists(libraryUploaders, agentsFallback);

  const translation = await getTranslations();

  return (
    <Card className="bg-transparent border-none shadow-none p-0">
      <CardHeader className="px-0 flex flex-col gap-2">
        <h1 className="text-[32px] font-bold">{translation(TRANSLATIONS_KEYS_2.DOCUMENTS.TITLE)}</h1>
        <p className="text-muted-foreground text-sm">{translation(TRANSLATIONS_KEYS_2.DOCUMENTS.DESCRIPTION)}</p>
      </CardHeader>
      <CardContent className="px-0">
        <Suspense fallback={null}>
          <DocumentsView
            data={files}
            folders={folders}
            agents={agents}
            canManageDocuments={canManageDocuments}
            canViewConfidentialDocuments={canViewConfidentialDocuments}
          />
        </Suspense>
      </CardContent>
    </Card>
  );
}
