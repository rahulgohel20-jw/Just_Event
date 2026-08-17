import { useEffect, useMemo, useState } from "react";
import {
    X,
    Plus,
    Paperclip,
    Download,
    Calendar,
    ClipboardCheck,
    Trash2,
    Loader2,
    ImageIcon,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import Swal from "sweetalert2";
import { TableComponent } from "@/components/table/TableComponent";
import { AddFollowUp, GetFollowUp, DeleteFollowUp } from "../../../services/apiServices";
import { showApiError } from "@/utils/swalHelpers";
import { AddFollowUpModal } from "./AddFollowUpModal";

const DEFAULT_PAGE_SIZE = 10;

const legendItems = [
    { label: "Confirm", color: "bg-green-500" },
    { label: "R Estimate", color: "bg-primary" },
    { label: "Inquiry", color: "bg-blue-400" },
    { label: "Cancel", color: "bg-red-500" },
];

// Backend fileType has been loosely formatted before (e.g. Presentation's
// "http://localhost:9091IMAGE"), so match loosely on "IMAGE" rather than an
// exact string.
const isImageFile = (file) => (file?.fileType ?? "").toUpperCase().includes("IMAGE");

const initials = (name) =>
    (name ?? "U")
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase() || "U";

const ChatBoxModel = ({ open, onClose, eventId, eventData }) => {
    const userId = Number(localStorage.getItem("userId")) || 0;
    const managerId = Number(localStorage.getItem("managerId") ?? userId);

    const [followUps, setFollowUps] = useState([]);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [addModalOpen, setAddModalOpen] = useState(false);

    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
    const [sortBy] = useState("id");
    const [sortDirection] = useState("DESC");

    // Lightbox state for viewing an attached file
    const [previewFiles, setPreviewFiles] = useState(null);
    const [previewIndex, setPreviewIndex] = useState(0);

    const fetchFollowUps = async () => {
        if (!eventId) return;
        setLoading(true);
        try {
            const payload = {
                eventId: Number(eventId),
                managerId: null,
                page: pageIndex,
                size: pageSize,
                sortBy,
                sortDirection,
                userId,
            };

            const res = await GetFollowUp(payload);
            const body = res?.data ?? res;
            const pageData = body?.data ?? body;

            setFollowUps(pageData?.content ?? []);
            setTotalElements(pageData?.totalElements ?? 0);
        } catch (err) {
            console.error("Failed to load follow-ups:", err);
            setFollowUps([]);
            setTotalElements(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open) fetchFollowUps();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, eventId, pageIndex, pageSize]);

    const handleFollowUpSaved = () => {
        setPageIndex(0);
        fetchFollowUps();
    };

    const handleDelete = async (row) => {
        const confirm = await Swal.fire({
            icon: "warning",
            title: "Delete this follow-up?",
            showCancelButton: true,
            confirmButtonText: "Delete",
            confirmButtonColor: "#dc2626",
        });
        if (!confirm.isConfirmed) return;

        setDeletingId(row.id);
        try {
            await DeleteFollowUp(row.id);
            Swal.fire({ icon: "success", title: "Deleted", timer: 1000, showConfirmButton: false });
            if (followUps.length === 1 && pageIndex > 0) {
                setPageIndex((prev) => prev - 1);
            } else {
                fetchFollowUps();
            }
        } catch (err) {
            console.error("Failed to delete follow-up:", err);
            showApiError(err, { title: "Failed to delete" });
        } finally {
            setDeletingId(null);
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
                    const index = pageIndex * pageSize + followUps.findIndex((a) => a.id === row.original.id);
                    return (
                        <span className="font-semibold text-gray-300">
                            {String(index + 1).padStart(2, "0")}
                        </span>
                    );
                },
            },

            {
                // API returns createdAt (often null in practice) rather than
                // separate createdDate/createdTime strings — derive both
                // display pieces from it, falling back to "—" when absent.
                accessorKey: "createdAt",
                header: "CREATED DATE",
                cell: ({ row }) => {
                    const raw = row.original.createdAt;
                    if (!raw) {
                        return <p className="text-sm text-gray-400 m-0">—</p>;
                    }
                    const parsed = new Date(raw);
                    const dateStr = Number.isNaN(parsed.getTime())
                        ? raw
                        : parsed.toLocaleDateString("en-GB");
                    const timeStr = Number.isNaN(parsed.getTime())
                        ? ""
                        : parsed.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                    return (
                        <div>
                            <p className="text-sm font-bold text-dark m-0">{dateStr}</p>
                            <p className="text-xs text-gray-400 m-0">{timeStr}</p>
                        </div>
                    );
                },
            },

            {
                accessorKey: "managerName",
                header: "MANAGER NAME",
                cell: ({ row }) => {
                    const name = row.original.managerName ?? row.original.followManagerName ?? "—";
                    return (
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-white">
                                {initials(name)}
                            </div>
                            <p className="text-sm font-bold uppercase text-dark m-0">{name}</p>
                        </div>
                    );
                },
            },

            {
                accessorKey: "description",
                header: "DESCRIPTION",
                cell: ({ row }) => (
                    <p className="max-w-sm text-sm text-dark-light">{row.original.description}</p>
                ),
            },

            {
                // API field is followUpDate (not followDate).
                accessorKey: "followUpDate",
                header: "FOLLOW DATE",
                cell: ({ row }) => (
                    <span className="flex w-fit items-center gap-2 rounded-lg bg-primary-lighest px-3 py-1.5 text-sm font-semibold text-primary">
                        <Calendar size={14} />
                        {row.original.followUpDate ?? "—"}
                    </span>
                ),
            },

            {
                id: "attach",
                header: "ATTACH",
                cell: ({ row }) => {
                    // API field is attachments (not files).
                    const files = row.original.attachments ?? [];
                    if (!files.length) {
                        return <span className="text-xs text-gray-400">No file</span>;
                    }
                    return (
                        <button
                            onClick={() => openPreview(files, 0)}
                            title="View attachment"
                            className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-inverse text-primary hover:bg-primary hover:text-white"
                        >
                            <Paperclip size={16} />
                        </button>
                    );
                },
            },

            {
                id: "actions",
                header: "ACTIONS",
                cell: ({ row }) => (
                    <button
                        onClick={() => handleDelete(row.original)}
                        disabled={deletingId === row.original.id}
                        title="Delete"
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-danger hover:bg-red-100 disabled:opacity-60"
                    >
                        {deletingId === row.original.id ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <Trash2 size={16} />
                        )}
                    </button>
                ),
            },
        ],
        [followUps, pageIndex, pageSize, deletingId]
    );

    if (!open) return null;

    const activePreviewFile = previewFiles?.[previewIndex] ?? null;

    return (
        <>
            <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />

            <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                <div
                    className="flex w-full max-w-6xl max-h-[90vh] flex-col rounded-[24px] bg-white shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header - stays fixed */}
                    <div className="flex items-center justify-between border-b px-8 py-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-inverse">
                                <ClipboardCheck size={20} className="text-primary" />
                            </div>
                            <div>
                                <h2 className="text-xl text-dark m-0">Follow-up Module</h2>
                                <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-gray-500 m-0">
                                    Event Management Dashboard
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-5 bg-primary-inverse py-2 px-4 rounded-xl">
                            {legendItems.map((item) => (
                                <span key={item.label} className="flex items-center gap-1.5 text-sm text-dark-light">
                                    <span className={`h-2 w-2 rounded-full ${item.color}`} />
                                    {item.label}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Party / Event info row - stays fixed */}
                    <div className="flex items-center justify-between px-8 py-5 gap-6">
                        <div className="flex items-center gap-10 w-[80%] justify-between">
                            <div>
                                <p className="text-[11px] font-semibold uppercase tracking-widest text-primary-active">
                                    Party Info
                                </p>
                                <div className="mt-1 flex items-center gap-2 my-auto">
                                    <p className="text-sm font-bold text-dark m-0">
                                        {eventData?.partyNameEnglish || "—"}
                                    </p>
                                    {eventData?.otherInfo?.groomContactNumber || eventData?.otherInfo?.brideContactNumber ? (
                                        <span className="rounded-md bg-primary-inverse px-2.5 py-1 text-xs font-semibold text-dark-light">
                                            {eventData.otherInfo.groomContactNumber || eventData.otherInfo.brideContactNumber}
                                        </span>
                                    ) : null}
                                </div>
                            </div>

                            <div>
                                <p className="text-[11px] font-semibold uppercase tracking-widest text-primary-active m-0">
                                    Event Info
                                </p>
                                <div className="mt-1 flex items-center gap-2">
                                    <p className="text-sm text-dark m-0">{eventData?.eventNameEnglish || "—"}</p>
                                    <span className="h-1 w-1 rounded-full bg-gray-300" />
                                    <p className="text-sm text-dark m-0">{eventData?.eventStartDate || "—"}</p>
                                    <span className="rounded-xl bg-primary-inverse px-3 py-1.2 text-[10px] font-bold uppercase tracking-wide text-primary">
                                        {eventData?.eventStatus || "—"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setAddModalOpen(true)}
                            className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-wide text-white shadow-sm hover:opacity-90"
                        >
                            <Plus size={15} />
                            Add Item
                        </button>
                    </div>

                    {/* Scrollable body */}
                    <div className="flex-1 overflow-y-auto px-8">
                        {followUps.length ? (
                            <TableComponent
                                columns={columns}
                                tableData={followUps}
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
                                Loading follow-ups...
                            </div>
                        ) : (
                            <div className="py-10 text-center">
                                <p className="text-xs uppercase tracking-widest italic text-gray-500">
                                    No follow-ups yet
                                </p>
                            </div>
                        )}

                        <div className="py-4 text-center">
                            <p className="text-xs uppercase tracking-widest italic text-gray-500">
                                End of recent follow-ups
                            </p>
                        </div>
                    </div>

                    {/* Footer - stays fixed */}
                    <div className="flex items-center justify-end gap-3 border-t border-primary-clarity px-8 py-6">
                        {/* <button className="flex items-center gap-2 rounded-lg border border-primary-clarity px-6 py-3 text-xs font-semibold uppercase tracking-wide text-dark hover:bg-light">
                            <Download size={15} />
                            Export PDF
                        </button> */}

                        <button
                            onClick={onClose}
                            className="rounded-lg bg-primary-inverse px-8 py-3 text-xs font-bold uppercase tracking-widest text-primary hover:bg-primary hover:text-white"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>

            {/* Image lightbox — attachment viewer, no approval controls */}
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

                    <div className="flex max-h-full max-w-4xl flex-col items-center gap-3" onClick={(e) => e.stopPropagation()}>
                        {activePreviewFile && isImageFile(activePreviewFile) ? (
                            <img
                                src={activePreviewFile.path}
                                alt=""
                                className="max-h-[75vh] max-w-full rounded-lg object-contain shadow-2xl"
                            />
                        ) : (
                            <div className="flex h-64 w-64 flex-col items-center justify-center gap-3 rounded-lg bg-white/10 text-white">
                                <ImageIcon size={32} />
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

            <AddFollowUpModal
                open={addModalOpen}
                onClose={() => setAddModalOpen(false)}
                onSave={handleFollowUpSaved}
                eventId={eventId}
            />
        </>
    );
};

export default ChatBoxModel;