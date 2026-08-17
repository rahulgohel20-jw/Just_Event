import { useEffect, useMemo, useRef, useState } from "react";
import {
  X,
  Upload,
  ShieldCheck,
  FileText,
  Trash2,
  Archive,
  Loader2,
  Check,
  ImageIcon,
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react";
import Swal from "sweetalert2";
import { TableComponent } from "@/components/table/TableComponent";
import {
  AddPresentation,
  GetAllPresentation,
  DeletePresenation,
  ApprovedPresentation,
} from "../../../services/apiServices"; // adjust path to match your services folder

const MEDIA_TYPE = "PRESENTATION";
const DEFAULT_PAGE_SIZE = 10;

// Backend currently sends fileType as e.g. "http://localhost:9091IMAGE" (looks
// like a base-URL + type concat bug), so match loosely on "IMAGE" rather than
// an exact string — keeps working once/if the backend sends a clean value.
const isImageFile = (file) => (file?.fileType ?? "").toUpperCase().includes("IMAGE");

const PresentationModel = ({ open, onClose, eventId }) => {
  const userId = Number(localStorage.getItem("userId"));
  const managerId = Number(localStorage.getItem("managerId") ?? userId);

  const [attachments, setAttachments] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [approvingId, setApprovingId] = useState(null);

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [sortBy] = useState("id");
  const [sortDirection] = useState("DESC");

  // Lightbox state: which file list we're viewing + current index within it
  const [previewFiles, setPreviewFiles] = useState(null); // array of files, or null when closed
  const [previewIndex, setPreviewIndex] = useState(0);

  const fileInputRef = useRef(null);

  const fetchList = async () => {
    if (!eventId) return;
    setLoading(true);
    try {
      const payload = {
        eventId: Number(eventId),
        isApprove: null,
        managerId,
        mediaType: MEDIA_TYPE,
        page: pageIndex,
        size: pageSize,
        sortBy,
        sortDirection,
        userId,
      };
     
      const res = await GetAllPresentation(payload);
      const body = res?.data ?? res;
      const pageData = body?.data ?? body;

      setAttachments(pageData?.content ?? []);
      setTotalElements(pageData?.totalElements ?? 0);
    } catch (err) {
      console.error("Failed to load presentations:", err);
      setAttachments([]);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, eventId, pageIndex, pageSize]);

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileSelected = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!eventId) {
      Swal.fire({ icon: "warning", title: "Missing eventId" });
      return;
    }


    const dto = {
      eventId: Number(eventId),
      id: null,
      managerId,
      mediaType: MEDIA_TYPE,
      userId,
    };

    const formData = new FormData();
    formData.append("data", new Blob([JSON.stringify(dto)], { type: "application/json" }));
    formData.append("files", file);



    setUploading(true);
    try {
      await AddPresentation(formData);
      Swal.fire({ icon: "success", title: "File uploaded", timer: 1200, showConfirmButton: false });
      setPageIndex(0);
      fetchList();
    } catch (err) {
      console.error("Failed to upload presentation:", err);
      Swal.fire({ icon: "error", title: "Failed to upload file" });
    } finally {
      setUploading(false);
    }
  };

  const handleApprove = async (row) => {
    const confirm = await Swal.fire({
      icon: "question",
      title: "Approve this media?",
      showCancelButton: true,
      confirmButtonText: "Approve",
      confirmButtonColor: "#16a34a",
    });
    if (!confirm.isConfirmed) return;

    const payload = {
      approvedManagerId: managerId,
      eventMediaId: row.id,
      userId,
    };

    setApprovingId(row.id);
    try {
      await ApprovedPresentation(payload);
      Swal.fire({ icon: "success", title: "Approved", timer: 1000, showConfirmButton: false });
      fetchList();
    } catch (err) {
      console.error("Failed to approve presentation:", err);
      Swal.fire({ icon: "error", title: "Failed to approve" });
    } finally {
      setApprovingId(null);
    }
  };

  const handleDelete = async (row) => {
    const confirm = await Swal.fire({
      icon: "warning",
      title: "Delete this file?",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#dc2626",
    });
    if (!confirm.isConfirmed) return;

    try {
      await DeletePresenation(row.id);
      Swal.fire({ icon: "success", title: "Deleted", timer: 1000, showConfirmButton: false });
      if (attachments.length === 1 && pageIndex > 0) {
        setPageIndex((prev) => prev - 1);
      } else {
        fetchList();
      }
    } catch (err) {
      console.error("Failed to delete presentation:", err);
      Swal.fire({ icon: "error", title: "Failed to delete file" });
    }
  };

  const openPreview = (files, startIndex = 0) => {
    if (!files?.length) return;
    setPreviewFiles(files);
    setPreviewIndex(startIndex);
  };
  const closePreview = () => setPreviewFiles(null);
  const showPrev = () => setPreviewIndex((i) => (i - 1 + previewFiles.length) % previewFiles.length);
  const showNext = () => setPreviewIndex((i) => (i + 1) % previewFiles.length);

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "SR. NO.",
        cell: ({ row }) => {
          const index = pageIndex * pageSize + attachments.findIndex((a) => a.id === row.original.id);
          return <span className="font-semibold text-gray-300">{String(index + 1).padStart(2, "0")}</span>;
        },
      },
      {
        accessorKey: "files",
        header: "FILE INFORMATION",
        cell: ({ row }) => {
          const files = row.original.files ?? [];
          const fileCount = files.length;
          const firstImage = files.find(isImageFile);

          return (
            <button
              type="button"
              onClick={() => fileCount && openPreview(files, files.indexOf(firstImage ?? files[0]))}
              disabled={!fileCount}
              className="group flex items-center gap-4 py-2 text-left disabled:cursor-default"
              title={fileCount ? "View attachment" : undefined}
            >
              <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-primary-inverse">
                {firstImage ? (
                  <img
                    src={firstImage.path}
                    alt=""
                    className="h-full w-full object-cover transition group-hover:scale-105"
                  />
                ) : (
                  <FileText size={20} className="text-primary" />
                )}
              </div>
              <div>
                <p className="text-sm font-bold text-dark m-0 group-hover:text-primary">
                  {fileCount ? `${fileCount} file${fileCount > 1 ? "s" : ""}` : "No files"}
                </p>
                <p className="text-xs text-gray-400 m-0">{row.original.mediaType}</p>
              </div>
            </button>
          );
        },
      },
      {
        accessorKey: "managerName",
        header: "UPLOADED BY",
        cell: ({ row }) => (
          <div className="flex items-center gap-3 my-auto">
            <div className="flex h-9 w-9 items-center m-0 justify-center rounded-full bg-primary-clarity/30 text-[11px] font-bold text-primary">
              {(row.original.managerName ?? "U").slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold text-dark m-0">
                {row.original.managerName ?? "—"}
              </p>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "isApprove",
        header: "STATUS",
        cell: ({ row }) => (
          <div>
            <span
              className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide ${
                row.original.isApprove
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-danger-lighter text-danger-active border border-danger-clarity"
              }`}
            >
              {row.original.isApprove ? "Approved" : "Pending"}
            </span>
            {row.original.isApprove && row.original.approvedManagerName && (
              <p className="mt-1 text-[10px] text-gray-400 m-0">
                by {row.original.approvedManagerName}
              </p>
            )}
          </div>
        ),
      },
      {
        accessorKey: "approvedDate",
        header: "APPROVED ON",
        cell: ({ row }) => (
          <span className="text-sm font-medium text-dark">
            {row.original.approvedDate ? row.original.approvedDate : "—"}
          </span>
        ),
      },
      {
        id: "actions",
        header: "ACTION",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            {!row.original.isApprove && (
              <button
                onClick={() => handleApprove(row.original)}
                disabled={approvingId === row.original.id}
                title="Approve"
                className="flex h-9 w-9 items-center justify-center rounded-full text-green-600 bg-green-50 hover:bg-green-100 disabled:opacity-60"
              >
                {approvingId === row.original.id ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Check size={16} />
                )}
              </button>
            )}
            <button
              onClick={() => handleDelete(row.original)}
              title="Delete"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-danger hover:bg-red-100"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ),
      },
    ],
    [attachments, pageIndex, pageSize, approvingId]
  );

  if (!open) return null;

  const activePreviewFile = previewFiles?.[previewIndex] ?? null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
        <div
          className="flex w-full max-w-4xl max-h-[90vh] flex-col rounded-[28px] bg-white shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-8 pt-7 pb-5">
            <div>
              <h2 className="text-xl font-extrabold text-primary">Presentation Details</h2>
              <p className="mt-1 text-sm text-gray-600">Manage and review event media files</p>
            </div>

            <div className="flex items-center gap-3">
              <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileSelected} />
              <button
                onClick={handleUploadClick}
                disabled={uploading}
                className="flex items-center gap-2 rounded-xl border border-primary-clarity/40 px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-primary hover:bg-light disabled:opacity-60"
              >
                {uploading ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
                {uploading ? "Uploading..." : "Upload"}
              </button>

              <button
                onClick={onClose}
                className="ml-1 flex h-8 w-8 items-center justify-center text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-8">
            <div className="pb-4">
              {attachments.length ? (
                <TableComponent
                  columns={columns}
                  tableData={attachments}
                  loading={loading}
                  paginationSize={pageSize}
                  pageIndex={pageIndex}
                  pageCount={Math.ceil(totalElements / pageSize) || 1}
                  totalElements={totalElements}
                  onPageChange={setPageIndex}
                  onPageSizeChange={(size) => {
                    setPageIndex(0);
                    setPageSize(size);
                  }}
                  defaultSorting={[{ id: "id", desc: false }]}
                />
              ) : loading ? (
                <div className="flex items-center justify-center gap-2 py-10 text-sm text-gray-500">
                  <Loader2 size={16} className="animate-spin" />
                  Loading files...
                </div>
              ) : (
                <div className="mb-6 flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-200 bg-primary-lighest py-10">
                  <Archive size={35} className="text-gray-300" />
                  <p className="text-sm text-gray-600 m-0">No presentation files uploaded yet</p>
                </div>
              )}
            </div>

            {/* Security note */}
            <div className="mb-6 flex items-start gap-4 rounded-2xl bg-primary-inverse p-6 my-auto border border-primary-clarity">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-clarity">
                <ShieldCheck size={16} className="text-primary" />
              </div>
              <div>
                <div className="mb-1.5 flex items-center gap-2 my-auto">
                  <p className="text-sm font-bold text-primary m-0">Enterprise Security Protocols</p>
                  <span className="rounded-full bg-primary-clarity px-2.5 py-0.2 text-[9px] font-bold uppercase tracking-wide text-primary">
                    Active
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-gray-800">
                  All uploaded presentations are encrypted at rest and in transit via
                  enterprise-grade AES-256 protocols. A comprehensive version history
                  and immutable audit trail is maintained for compliance and
                  verification purposes.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-start border-t px-8 py-6">
            <button
              onClick={onClose}
              className="rounded-xl bg-primary-inverse px-8 py-3 text-xs font-bold uppercase tracking-widest text-primary hover:bg-primary hover:text-white"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Image lightbox — separate top-most overlay, only mounted while previewing */}
      {previewFiles && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-6"
          onClick={closePreview}
        >
          <button
            onClick={closePreview}
            className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            title="Close"
          >
            <X size={20} />
          </button>

          {previewFiles.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  showPrev();
                }}
                className="absolute left-6 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
                title="Previous"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  showNext();
                }}
                className="absolute right-6 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
                title="Next"
              >
                <ChevronRight size={22} />
              </button>
            </>
          )}

          <div
            className="flex max-h-full max-w-4xl flex-col items-center gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            {activePreviewFile && isImageFile(activePreviewFile) ? (
              <img
                src={activePreviewFile.path}
                alt=""
                className="max-h-[75vh] max-w-full rounded-lg object-contain shadow-2xl"
              />
            ) : (
              <div className="flex h-64 w-64 flex-col items-center justify-center gap-3 rounded-lg bg-white/10 text-white">
                <FileText size={32} />
                <p className="text-sm">Preview not available</p>
              </div>
            )}

            <div className="flex items-center gap-4">
              {previewFiles.length > 1 && (
                <span className="text-xs font-medium text-white/70">
                  {previewIndex + 1} / {previewFiles.length}
                </span>
              )}
              {activePreviewFile?.path && (
                <a
                  href={activePreviewFile.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-semibold text-white/90 hover:text-white"
                >
                  <Download size={13} />
                  Open original
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PresentationModel;