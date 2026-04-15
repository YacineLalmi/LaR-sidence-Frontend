"use client";

import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { DocumentsLibraryToolbar } from "./documents-library-toolbar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PaginatedResponse } from "@/lib/definitions";
import { ListItem } from "@/schemas/global.schema";
import { LibraryFile, LibraryFolder } from "@/schemas/documents/library-file.schema";
import { bulkDownloadDocumentsAction } from "@/actions/documents/bulk-download-documents.action";
import { deleteDocumentAction } from "@/actions/documents/delete-document.action";
import { downloadDocumentBlobAction } from "@/actions/documents/download-document.action";
import { loadDocumentPreviewAction } from "@/actions/documents/load-document-preview.action";
import { uploadDocumentAction } from "@/actions/documents/upload-document.action";
import { createFolderAction } from "@/actions/documents/create-folder.action";
import { deleteFolderAction } from "@/actions/documents/delete-folder.action";
import { DocumentShareModal } from "./document-share-modal";
import { cn, customToast } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
  Eye,
  FileText,
  Folder,
  Grid3x3,
  LayoutGrid,
  LayoutList,
  Loader2,
  Lock,
  MoreVertical,
  Plus,
  Trash2,
  UserPlus,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useMemo, useRef, useState, useTransition } from "react";

interface Props {
  data: PaginatedResponse<LibraryFile>;
  folders: LibraryFolder[];
  agents: ListItem[];
  /** MDOC — upload, delete */
  canManageDocuments: boolean;
  /** VDOCC — mark uploads as confidential + see confidential badge */
  canViewConfidentialDocuments: boolean;
}

function formatBytes(n: number) {
  if (n < 1024) return `${n} o`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} Ko`;
  return `${(n / (1024 * 1024)).toFixed(1)} Mo`;
}

function downloadFromBase64(base64: string, filename: string, mime: string) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  const blob = new Blob([bytes], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function base64ToBlobUrl(base64: string, mimeType: string): string {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  const blob = new Blob([bytes], { type: mimeType || "application/octet-stream" });
  return URL.createObjectURL(blob);
}

/** Matches preview UI: image branch uses mime or common image extensions. */
function isPreviewImageFile(file: LibraryFile): boolean {
  const mime = (file.mime_type || "").toLowerCase();
  if (mime.startsWith("image/")) return true;
  const ext = (file.type || "").toLowerCase().replace(/^\./, "");
  return ["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg", "heic", "heif"].includes(ext);
}

/**
 * Print an image blob URL in a hidden iframe (avoids window.open + noopener returning null, and popup blockers).
 */
function printImageBlobInHiddenIframe(blobUrl: string): boolean {
  const iframe = document.createElement("iframe");
  iframe.setAttribute(
    "style",
    "position:fixed;right:0;bottom:0;width:0;height:0;border:0;opacity:0;pointer-events:none"
  );
  document.body.appendChild(iframe);
  const doc = iframe.contentDocument;
  if (!doc) {
    iframe.remove();
    return false;
  }
  const safeSrc = blobUrl.replace(/"/g, "&quot;");
  doc.open();
  doc.write(
    `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>Print</title>` +
      `<style>html,body{margin:0;height:100%}body{display:flex;justify-content:center;align-items:center;background:#fff}` +
      `img{max-width:100%;max-height:100vh;object-fit:contain}</style></head><body>` +
      `<img src="${safeSrc}" alt="" onload="window.focus();window.print()" />` +
      `</body></html>`
  );
  doc.close();

  const win = iframe.contentWindow;
  if (!win) {
    iframe.remove();
    return false;
  }

  const removeIframe = () => {
    try {
      iframe.remove();
    } catch {
      /* noop */
    }
  };
  win.addEventListener("afterprint", removeIframe, { once: true });
  setTimeout(removeIframe, 120_000);
  return true;
}

function fileTypeLabel(file: LibraryFile): string {
  const mime = (file.mime_type || "").toLowerCase();
  const ext = (file.type || "").toLowerCase();
  if (mime.includes("pdf") || ext === "pdf") return "PDF";
  if (mime.includes("word") || mime.includes("msword") || ["doc", "docx"].includes(ext)) return "DOC";
  if (mime.startsWith("image/")) return "IMG";
  if (["js", "mjs", "cjs"].includes(ext) || mime.includes("javascript")) return "JS";
  if (ext) return ext.slice(0, 6).toUpperCase();
  return "FILE";
}

function uploaderInitials(u: NonNullable<LibraryFile["uploader"]>): string {
  const a = (u.first_name?.[0] || "").toUpperCase();
  const b = (u.last_name?.[0] || "").toUpperCase();
  const pair = (a + b) || "?";
  return pair.slice(0, 2);
}

function uploaderDisplayName(u: NonNullable<LibraryFile["uploader"]>): string {
  return `${u.first_name ?? ""} ${u.last_name ?? ""}`.trim() || "—";
}

function lastModifiedAt(file: LibraryFile): string | null {
  const raw = file.updated_at || file.created_at;
  return raw ? format(new Date(raw), "dd/MM/yyyy") : null;
}

export default function DocumentsView({
  data,
  folders,
  agents,
  canManageDocuments,
  canViewConfidentialDocuments,
}: Props) {
  const t = useTranslations("documents");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeFolderId = searchParams.get("folder") ?? "";

  const setFolderFilter = useCallback(
    (folderId: string | null) => {
      const p = new URLSearchParams(searchParams.toString());
      if (folderId) p.set("folder", folderId);
      else p.delete("folder");
      p.delete("page");
      router.push(`${pathname}?${p.toString()}`);
    },
    [pathname, router, searchParams]
  );

  const [view, setView] = useState<"grid" | "table">("table");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [preview, setPreview] = useState<{ file: LibraryFile; blobUrl: string } | null>(null);
  const [previewTarget, setPreviewTarget] = useState<LibraryFile | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [shareFile, setShareFile] = useState<LibraryFile | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<LibraryFile | null>(null);
  const [isPending, startTransition] = useTransition();
  const previewIframeRef = useRef<HTMLIFrameElement>(null);

  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [confidential, setConfidential] = useState(false);
  const [folderId, setFolderId] = useState<string>("");
  const [folderDialogOpen, setFolderDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [deleteFolderTarget, setDeleteFolderTarget] = useState<LibraryFolder | null>(null);

  const refresh = useCallback(() => {
    router.refresh();
  }, [router]);

  const onUpload = () => {
    if (!uploadFile) {
      customToast.error(t("messages.error"));
      return;
    }
    const fd = new FormData();
    fd.append("file", uploadFile);
    if (displayName) fd.append("display_name", displayName);
    fd.append("confidential", canViewConfidentialDocuments && confidential ? "1" : "0");
    if (folderId) fd.append("folder_id", folderId);

    startTransition(async () => {
      const res = await uploadDocumentAction(fd);
      if (res.isOk) {
        customToast.success(t("messages.uploaded"));
        setUploadOpen(false);
        setUploadFile(null);
        setDisplayName("");
        setConfidential(false);
        setFolderId("");
        refresh();
      } else {
        customToast.error(res.errorMessage || t("messages.error"));
      }
    });
  };

  const onCreateFolder = () => {
    startTransition(async () => {
      const res = await createFolderAction(newFolderName);
      if (res.isOk) {
        customToast.success(t("folders.created"));
        setNewFolderName("");
        setFolderDialogOpen(false);
        refresh();
      } else {
        customToast.error(res.errorMessage || t("messages.error"));
      }
    });
  };

  const onDeleteFolder = () => {
    if (!deleteFolderTarget) return;
    const id = deleteFolderTarget.id;
    startTransition(async () => {
      const res = await deleteFolderAction(id);
      if (res.isOk) {
        customToast.success(t("folders.deleted"));
        setDeleteFolderTarget(null);
        if (String(id) === activeFolderId) setFolderFilter(null);
        refresh();
      } else {
        customToast.error(res.errorMessage || t("messages.error"));
      }
    });
  };

  const closePreview = useCallback(() => {
    setPreviewTarget(null);
    setPreview((p) => {
      if (p?.blobUrl) URL.revokeObjectURL(p.blobUrl);
      return null;
    });
  }, []);

  const openPreview = useCallback(async (file: LibraryFile) => {
    setPreviewTarget(file);
    setPreview((prev) => {
      if (prev?.blobUrl) URL.revokeObjectURL(prev.blobUrl);
      return null;
    });
    setLoadingPreview(true);
    const r = await loadDocumentPreviewAction(file.id);
    setLoadingPreview(false);
    if (!r.ok) {
      customToast.error(r.message);
      setPreviewTarget(null);
      return;
    }
    const blobUrl = base64ToBlobUrl(r.base64, r.mimeType);
    setPreview({ file, blobUrl });
  }, []);

  const onPreviewDownload = useCallback(() => {
    if (!preview) return;
    startTransition(async () => {
      const r = await downloadDocumentBlobAction(preview.file.id, preview.file.original_name);
      if (!r.ok) {
        customToast.error(r.message);
        return;
      }
      downloadFromBase64(r.base64, r.filename, r.mimeType);
      customToast.success(t("messages.download_ready"));
    });
  }, [preview, t]);

  const onPreviewPrint = useCallback(() => {
    if (!preview) return;
    if (isPreviewImageFile(preview.file)) {
      if (!printImageBlobInHiddenIframe(preview.blobUrl)) {
        customToast.error(t("messages.error"));
      }
      return;
    }
    const frame = previewIframeRef.current;
    if (frame?.contentWindow) {
      try {
        frame.contentWindow.focus();
        frame.contentWindow.print();
      } catch {
        customToast.error(t("messages.error"));
      }
      return;
    }
    customToast.error(t("messages.error"));
  }, [preview, t]);

  const onBulkDownload = async (ids: string[]) => {
    if (!ids.length) return;
    const r = await bulkDownloadDocumentsAction(ids);
    if (!r.ok) {
      customToast.error(r.message);
      return;
    }
    downloadFromBase64(r.base64, r.filename, "application/zip");
    customToast.success(t("messages.download_ready"));
  };

  const onDelete = async () => {
    if (!deleteTarget) return;
    startTransition(async () => {
      const res = await deleteDocumentAction(deleteTarget.id);
      if (res.isOk) {
        customToast.success(t("messages.deleted"));
        setDeleteTarget(null);
        refresh();
      } else {
        customToast.error(res.errorMessage || t("messages.error"));
      }
    });
  };

  const columns: ColumnDef<LibraryFile>[] = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
            onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(v) => row.toggleSelected(!!v)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
      },
      {
        accessorKey: "original_name",
        header: t("columns.name"),
        cell: ({ row }) => {
          const f = row.original;
          const title = f.display_name || f.original_name;
          const folderName = f.folder?.name;
          return (
            <div className="flex min-w-0 items-center gap-3">
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-black"
                style={{ backgroundColor: "#E8D48A" }}
              >
                {fileTypeLabel(f)}
              </span>
              <div className="min-w-0 flex-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="block truncate font-medium text-foreground">{title}</span>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-md">
                    <p>{title}</p>
                  </TooltipContent>
                </Tooltip>
                {folderName ? (
                  <span className="block truncate text-xs text-muted-foreground">{folderName}</span>
                ) : null}
              </div>
            </div>
          );
        },
      },
      {
        id: "doc_type",
        header: t("columns.type"),
        cell: ({ row }) => (
          <span className="text-sm font-semibold uppercase tracking-wide text-foreground">
            {fileTypeLabel(row.original)}
          </span>
        ),
      },
      {
        id: "size",
        header: t("columns.size"),
        cell: ({ row }) => formatBytes(row.original.size),
      },
      {
        id: "updated_at",
        header: t("columns.updated"),
        cell: ({ row }) => lastModifiedAt(row.original) ?? "—",
      },
      {
        id: "owner",
        header: t("columns.owner"),
        cell: ({ row }) => {
          const u = row.original.uploader;
          if (!u) return "—";
          return (
            <div className="flex min-w-0 items-center gap-2">
              <Avatar className="h-8 w-8 border border-stone-200">
                <AvatarFallback className="bg-stone-200 text-[10px] font-medium text-foreground">
                  {uploaderInitials(u)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium leading-tight">{uploaderDisplayName(u)}</span>
                {u.email ? (
                  <span className="block truncate text-xs text-muted-foreground">{u.email}</span>
                ) : null}
              </div>
            </div>
          );
        },
      },
      ...(canViewConfidentialDocuments
        ? [
            {
              id: "confidential",
              header: t("columns.confidential"),
              cell: ({ row }) =>
                row.original.confidential ? (
                  <span className="inline-flex items-center gap-1 text-amber-800" title={t("columns.confidential")}>
                    <Lock className="h-4 w-4" />
                  </span>
                ) : (
                  "—"
                ),
            } satisfies ColumnDef<LibraryFile>,
          ]
        : []),
      {
        id: "actions",
        header: t("columns.actions"),
        cell: ({ row }) => {
          const f = row.original;
          const shareDisabled = !!f.confidential;
          return (
            <div className="flex items-center justify-end gap-0.5">
              {canManageDocuments && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  aria-label={t("actions.delete")}
                  onClick={() => setDeleteTarget(f)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground"
                aria-label={t("actions.preview")}
                onClick={() => openPreview(f)}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground disabled:opacity-40"
                aria-label={t("actions.share")}
                disabled={shareDisabled}
                title={shareDisabled ? t("columns.confidential") : t("actions.share")}
                onClick={() => setShareFile(f)}
              >
                <UserPlus className="h-4 w-4" />
              </Button>
            </div>
          );
        },
      },
    ],
    [t, canManageDocuments, canViewConfidentialDocuments, openPreview]
  );

  return (
    <TooltipProvider delayDuration={300}>
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <DocumentsLibraryToolbar agents={agents} />
        <div className="flex items-center gap-2">
          <div className="flex rounded-full border border-stone-300 p-0.5">
            <Button
              type="button"
              variant={view === "table" ? "secondary" : "ghost"}
              size="sm"
              className="rounded-full gap-1"
              onClick={() => setView("table")}
            >
              <LayoutList className="h-4 w-4" />
              {t("view_table")}
            </Button>
            <Button
              type="button"
              variant={view === "grid" ? "secondary" : "ghost"}
              size="sm"
              className="rounded-full gap-1"
              onClick={() => setView("grid")}
            >
              <Grid3x3 className="h-4 w-4" />
              {t("view_grid")}
            </Button>
          </div>
          {canManageDocuments && (
            <Button
              onClick={() => setUploadOpen(true)}
              className="rounded-full gap-1 bg-black text-white hover:bg-stone-800"
              style={{ borderColor: "#C8AB68" }}
            >
              <Plus className="h-4 w-4" />
              {t("add")}
            </Button>
          )}
        </div>
      </div>

      {(canManageDocuments || folders.length > 0) && (
        <section className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">{t("folders.title")}</h2>
            {canManageDocuments && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-full gap-1 border-stone-300 bg-white"
                onClick={() => setFolderDialogOpen(true)}
              >
                <Plus className="h-4 w-4" />
                {t("folders.create")}
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <button
              type="button"
              onClick={() => setFolderFilter(null)}
              className={cn(
                "flex w-full items-start gap-3 rounded-2xl border bg-white p-4 text-left shadow-sm transition-colors hover:bg-stone-50/90",
                !activeFolderId
                  ? "border-[#C8AB68] ring-2 ring-[#C8AB68]/30"
                  : "border-stone-200"
              )}
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-black text-white">
                <LayoutGrid className="h-5 w-5" aria-hidden />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold leading-tight text-foreground">{t("folders.card_all")}</p>
                <p className="mt-1 text-xs text-muted-foreground">{t("folders.card_all_subtitle")}</p>
              </div>
            </button>
            {folders.map((fo) => (
              <div
                key={String(fo.id)}
                className={cn(
                  "relative flex w-full items-start gap-3 rounded-2xl border bg-white p-4 text-left shadow-sm transition-colors hover:bg-stone-50/90",
                  activeFolderId === String(fo.id)
                    ? "border-[#C8AB68] ring-2 ring-[#C8AB68]/30"
                    : "border-stone-200"
                )}
              >
                <button
                  type="button"
                  className="flex min-w-0 flex-1 items-start gap-3 text-left"
                  onClick={() => setFolderFilter(String(fo.id))}
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-black text-white">
                    <Folder className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold leading-tight text-foreground">{fo.name}</span>
                    <span className="mt-1 block text-xs text-muted-foreground">
                      {t("folders.card_subtitle", {
                        size: formatBytes(fo.files_total_size ?? 0),
                        count: fo.files_count ?? 0,
                      })}
                    </span>
                  </span>
                </button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
                      aria-label={t("columns.actions")}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setFolderFilter(String(fo.id))}>{t("folders.open")}</DropdownMenuItem>
                    {canManageDocuments && (
                      <DropdownMenuItem className="text-destructive" onClick={() => setDeleteFolderTarget(fo)}>
                        {t("folders.delete")}
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
          {folders.length === 0 && canManageDocuments && (
            <p className="text-sm text-muted-foreground">{t("folders.empty")}</p>
          )}
        </section>
      )}

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">{t("files_section.title")}</h2>
        {view === "table" ? (
          <DataTable
            columns={columns}
            data={data}
            onBulkDownload={(ids) => void onBulkDownload(ids)}
            bulkDownloadLabel={t("actions.bulk_download")}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {(data.data ?? []).map((f) => (
              <Card key={f.id} className="flex flex-col gap-2 border-stone-200 bg-[#F9F7F2] p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-black"
                      style={{ backgroundColor: "#E8D48A" }}
                    >
                      {fileTypeLabel(f)}
                    </span>
                    {canViewConfidentialDocuments && f.confidential && (
                      <span title={t("columns.confidential")} className="inline-flex">
                        <Lock className="h-4 w-4 shrink-0 text-amber-800" aria-hidden />
                      </span>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-0.5">
                    {canManageDocuments && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        aria-label={t("actions.delete")}
                        onClick={() => setDeleteTarget(f)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground"
                      aria-label={t("actions.preview")}
                      onClick={() => openPreview(f)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground disabled:opacity-40"
                      aria-label={t("actions.share")}
                      disabled={!!f.confidential}
                      onClick={() => setShareFile(f)}
                    >
                      <UserPlus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="line-clamp-1 text-xs text-muted-foreground">{f.folder?.name ?? "—"}</p>
                <p className="line-clamp-2 font-medium">{f.display_name || f.original_name}</p>
                <p className="text-xs font-semibold uppercase tracking-wide text-foreground">{fileTypeLabel(f)}</p>
                <p className="text-xs text-muted-foreground">
                  {lastModifiedAt(f) ?? "—"} · {formatBytes(f.size)}
                </p>
              </Card>
            ))}
          </div>
        )}
      </section>

      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{t("upload_dialog.title")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <label className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-stone-300 bg-[#F9F7F2] p-8 cursor-pointer hover:bg-stone-100">
              <input
                type="file"
                className="hidden"
                onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)}
              />
              <FileText className="h-8 w-8" style={{ color: "#C8AB68" }} />
              <span className="text-sm text-center">{t("upload_dialog.drop")}</span>
              {uploadFile && <span className="text-xs font-medium">{uploadFile.name}</span>}
            </label>
            <div className="space-y-2">
              <Label>{t("upload_dialog.display_name")}</Label>
              <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
            </div>
            {canViewConfidentialDocuments && (
              <div className="flex items-center gap-2">
                <Switch checked={confidential} onCheckedChange={setConfidential} id="conf" />
                <Label htmlFor="conf">{t("upload_dialog.confidential")}</Label>
              </div>
            )}
            {canManageDocuments && (
              <div className="space-y-2">
                <Label>{t("upload_dialog.folder")}</Label>
                <Select value={folderId ? folderId : "__none__"} onValueChange={(v) => setFolderId(v === "__none__" ? "" : v)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t("upload_dialog.folder_placeholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">{t("upload_dialog.no_folder")}</SelectItem>
                    {folders.map((fo) => (
                      <SelectItem key={String(fo.id)} value={String(fo.id)}>
                        {fo.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadOpen(false)}>
              {t("delete_confirm.cancel")}
            </Button>
            <Button onClick={onUpload} disabled={isPending || !uploadFile}>
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : t("upload")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!previewTarget || loadingPreview}
        onOpenChange={(o) => {
          if (!o) closePreview();
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="max-w-4xl max-h-[90vh] gap-0 overflow-hidden p-0 sm:max-w-4xl"
        >
          <div className="relative flex max-h-[90vh] flex-col">
            <DialogHeader className="sr-only">
              <DialogTitle>
                {preview?.file.display_name ||
                  preview?.file.original_name ||
                  previewTarget?.display_name ||
                  previewTarget?.original_name}
              </DialogTitle>
            </DialogHeader>
            <button
              type="button"
              onClick={closePreview}
              className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black text-white shadow-md hover:bg-stone-900"
              aria-label={t("preview_dialog.close_aria")}
            >
              <span className="text-lg leading-none" aria-hidden>
                ×
              </span>
            </button>

            <div className="min-h-0 flex-1 overflow-auto px-4 pb-4 pt-14">
              {loadingPreview && <Loader2 className="h-8 w-8 animate-spin mx-auto my-12" />}
              {preview && !loadingPreview && (
                <div className="flex min-h-[50vh] items-center justify-center rounded-lg bg-muted/30">
                  {isPreviewImageFile(preview.file) ? (
                    <img
                      src={preview.blobUrl}
                      alt=""
                      className="max-h-[65vh] w-auto max-w-full object-contain"
                    />
                  ) : (
                    <iframe
                      ref={previewIframeRef}
                      title="preview"
                      src={preview.blobUrl}
                      className="h-[65vh] w-full rounded border-0 bg-white"
                    />
                  )}
                </div>
              )}
            </div>

            {preview && !loadingPreview && (
              <DialogFooter className="flex flex-row items-center justify-end gap-3 border-t border-stone-200 bg-[#FAFAF8] px-6 py-4 sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onPreviewDownload}
                  disabled={isPending}
                  className="rounded-full border-black bg-white px-6 text-foreground hover:bg-stone-50"
                >
                  {t("actions.download")}
                </Button>
                <Button
                  type="button"
                  onClick={onPreviewPrint}
                  className="rounded-full bg-black px-6 text-white hover:bg-stone-900"
                >
                  {t("preview_dialog.print")}
                </Button>
              </DialogFooter>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <DocumentShareModal file={shareFile} open={!!shareFile} onOpenChange={(o) => !o && setShareFile(null)} />

      <Dialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("delete_confirm.title")}</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              {t("delete_confirm.cancel")}
            </Button>
            <Button variant="destructive" onClick={onDelete} disabled={isPending}>
              {t("delete_confirm.confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={folderDialogOpen} onOpenChange={setFolderDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("folders.dialog_title")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="new-folder-name">{t("folders.dialog_name")}</Label>
            <Input
              id="new-folder-name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && newFolderName.trim() && onCreateFolder()}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFolderDialogOpen(false)}>
              {t("delete_confirm.cancel")}
            </Button>
            <Button onClick={onCreateFolder} disabled={isPending || !newFolderName.trim()}>
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : t("folders.dialog_submit")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteFolderTarget} onOpenChange={(o) => !o && setDeleteFolderTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("folders.delete_confirm_title")}</DialogTitle>
            <p className="text-sm text-muted-foreground pt-2">{t("folders.delete_confirm_hint")}</p>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteFolderTarget(null)}>
              {t("delete_confirm.cancel")}
            </Button>
            <Button variant="destructive" onClick={onDeleteFolder} disabled={isPending}>
              {t("delete_confirm.confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </TooltipProvider>
  );
}
