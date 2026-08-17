import { useEffect, useMemo, useRef, useState } from "react";
import {
  X,
  Upload,
  CheckCircle2,
  AlertTriangle,
  FileText,
  FileImage,
  Plus,
  Minus,
  Info,
  Loader2,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Swal from "sweetalert2";
import { TableComponent } from "@/components/table/TableComponent";
import {
  AddPresentation,
  GetAllPresentation,
  DeletePresenation,
  ApprovedPresentation,
} from "../../../services/apiServices";

const MEDIA_TYPE = "LAYOUT";
const DEFAULT_PAGE_SIZE = 10;

// Backend currently sends fileType as "http://localhost:9091IMAGE" (looks like
// a base-URL + type concat bug), so match loosely on "IMAGE" rather than an
// exact string — this still works once/if the backend sends a clean value.
const isImageFile = (file) => (file?.fileType ?? "").toUpperCase().includes("IMAGE");

const LayoutModel = ({ open, onClose, eventId, eventData }) => {
  const userId = Number(localStorage.getItem("userId"));
  const managerId = Number(localStorage.getItem("managerId") ?? userId);

  const [attachments, setAttachments] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [approvingId, setApprovingId] = useState(null);
  const [rejectingId, setRejectingId] = useState(null);

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [sortBy] = useState("id");
  const [sortDirection] = useState("DESC");

  // Lightbox state: which file list we're viewing + current index within it
  const [previewFiles, setPreviewFiles] = useState(null);
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
      console.error("Failed to load layout attachments:", err);
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
      Swal.fire({ icon: "success", title: "Layout uploaded", timer: 1200, showConfirmButton: false });
      setPageIndex(0);
      fetchList();
    } catch (err) {
      console.error("Failed to upload layout:", err);
      Swal.fire({ icon: "error", title: "Failed to upload layout" });
    } finally {
      setUploading(false);
    }
  };

  const handleApprove = async (row) => {
    const confirm = await Swal.fire({
      icon: "question",
      title: "Approve this layout?",
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
      console.error("Failed to approve layout:", err);
      Swal.fire({ icon: "error", title: "Failed to approve" });
    } finally {
      setApprovingId(null);
    }
  };

  const handleReject = async (row) => {
    const confirm = await Swal.fire({
      icon: "warning",
      title: "Reject / remove this layout?",
      text: "This will permanently delete the attachment.",
      showCancelButton: true,
      confirmButtonText: "Reject",
      confirmButtonColor: "#dc2626",
    });
    if (!confirm.isConfirmed) return;

    setRejectingId(row.id);
    try {
      await DeletePresenation(row.id);
      Swal.fire({ icon: "success", title: "Rejected", timer: 1000, showConfirmButton: false });
      if (attachments.length === 1 && pageIndex > 0) {
        setPageIndex((prev) => prev - 1);
      } else {
        fetchList();
      }
    } catch (err) {
      console.error("Failed to reject layout:", err);
      Swal.fire({ icon: "error", title: "Failed to reject item" });
    } finally {
      setRejectingId(null);
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

  const approvedCount = attachments.filter((a) => a.isApprove).length;
  const allApproved = attachments.length > 0 && approvedCount === attachments.length;

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "NO.",
        cell: ({ row }) => {
          const index = pageIndex * pageSize + attachments.findIndex((a) => a.id === row.original.id);
          return (
            <span className="font-semibold text-dark-clarity">
              {String(index + 1).padStart(2, "0")}
            </span>
          );
        },
      },
      {
        accessorKey: "files",
        header: "FILE INFORMATION",
        cell: ({ row }) => {
          const files = row.original.files ?? [];
          const firstFile = files[0];
          if (!firstFile) {
            return <p className="text-sm text-dark-light m-0">No file</p>;
          }
          return (
            <button
              type="button"
              onClick={() => openPreview(files, 0)}
              className="flex items-center gap-4 py-2 text-left"
              title="View attachment"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-inverse overflow-hidden">
                {isImageFile(firstFile) ? (
                  <img src={firstFile.path} alt="" className="h-full w-full object-cover" />
                ) : (
                  <FileText size={22} className="text-gray-600" />
                )}
              </div>
              <div>
                <p className="font-semibold uppercase text-dark m-0">
                  {firstFile.fileName ?? (isImageFile(firstFile) ? "Image file" : "Document")}
                </p>
                <p className="text-[9px] text-gray-400 uppercase m-0">
                  {files.length > 1 ? `${files.length} files` : isImageFile(firstFile) ? "Image" : "Document"}
                </p>
              </div>
            </button>
          );
        },
      },
      {
        accessorKey: "managerName",
        header: "UPLOADER",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
              {(row.original.managerName ?? "U").slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold uppercase m-0">{row.original.managerName ?? "—"}</p>
              <p className="text-[11px] uppercase text-gray-400 m-0">
                {row.original.isApprove ? "Approved" : "Pending"}
              </p>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "createdDate",
        header: "DATE",
        cell: ({ row }) => (
          <span className="font-medium">{row.original.createdDate ?? "—"}</span>
        ),
      },
      {
        id: "actions",
        header: "ACTIONS",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            {!row.original.isApprove && (
              <button
                onClick={() => handleApprove(row.original)}
                disabled={approvingId === row.original.id}
                title="Approve"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600 hover:bg-green-200 disabled:opacity-60"
              >
                {approvingId === row.original.id ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Plus size={18} />
                )}
              </button>
            )}
            <button
              onClick={() => handleReject(row.original)}
              disabled={rejectingId === row.original.id}
              title="Reject"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-500 hover:bg-red-200 disabled:opacity-60"
            >
              {rejectingId === row.original.id ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Minus size={18} />
              )}
            </button>
          </div>
        ),
      },
    ],
    [attachments, pageIndex, pageSize, approvingId, rejectingId]
  );

  if (!open) return null;

  const activePreviewFile = previewFiles?.[previewIndex] ?? null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
        <div
          className="flex w-full max-w-6xl max-h-[90vh] flex-col rounded-2xl bg-white shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header - stays fixed */}
          <div className="flex items-center justify-between border-b px-6 py-5">
            <div>
              <h2 className="text-xl font-bold text-primary">Layout Details</h2>
              <p className="text-xs text-gray-500">
                {eventData?.eventNameEnglish ? eventData.eventNameEnglish.toUpperCase() : "DOCUMENT MANAGEMENT"}
              </p>
            </div>

            <div className="flex flex-col gap-5 p-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-2">
                <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileSelected} />
                <button
                  onClick={handleUploadClick}
                  disabled={uploading}
                  className="flex items-center gap-2 rounded-xl uppercase px-5 py-2.5 text-xs font-medium text-primary border border-primary-clarity bg-light disabled:opacity-60"
                >
                  {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                  {uploading ? "Uploading..." : "Upload"}
                </button>
              </div>
              <button onClick={onClose}>
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-6 pt-6">
              <div className="rounded-3xl bg-primary-lighest py-10 flex justify-center">
                <div className="flex items-center gap-5 rounded-2xl border bg-light px-8 py-3 shadow-sm">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full ${
                      allApproved ? "bg-success-lighter" : "bg-danger-lighter"
                    }`}
                  >
                    {allApproved ? (
                      <CheckCircle2 size={26} className="text-success" />
                    ) : (
                      <AlertTriangle size={26} className="text-danger" />
                    )}
                  </div>

                  <div>
                    <h2 className="text-2xl font-black tracking-wider text-primary uppercase p-0 m-0">
                      {allApproved ? "Approved" : "Pending Review"}
                    </h2>
                    <p className="text-[11px] uppercase tracking-[3px] text-gray-400 m-0">
                      Verification Status
                    </p>
                    <p className="text-[11px] uppercase tracking-[3px] text-gray-400 m-0">
                      {attachments.length ? `${approvedCount} of ${attachments.length} approved` : "No layouts yet"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-8">
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
                  Loading layouts...
                </div>
              ) : (
                <div className="py-10 text-center">
                  <p className="text-xs uppercase tracking-widest italic text-gray-500">
                    No layout attachments yet
                  </p>
                </div>
              )}
            </div>

            <div className="px-6 pb-6 my-5">
              <div className="flex items-center gap-4 rounded-2xl border bg-primary-lighest p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-white">
                  <Info size={18} className="text-dark-clarity" />
                </div>
                <p className="text-sm text-gray-700 my-auto">
                  Viewing live layout attachments for this event. Only Admin roles can
                  finalize the approval state of these documents.
                </p>
              </div>
            </div>
          </div>

          {/* Footer - stays fixed */}
          <div className="flex justify-end border-t border-primary-clarity px-6 py-6">
            <button
              onClick={onClose}
              className="rounded-full border border-primary-clarity px-14 py-2 uppercase tracking-widest text-dark-active"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Image lightbox */}
      {previewFiles && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-6"
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
                <FileImage size={32} />
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

export default LayoutModel;