import { useMemo, useState } from "react";
import {
    X,
    Upload,
    ShieldCheck,
    FileText,
    Plus,
    Trash2,
    Archive,
} from "lucide-react";
import { TableComponent } from "@/components/table/TableComponent";

const initialAttachments = [
    {
        id: 1,
        name: "CDA-21.02.21.PDF",
        size: "12.4 MB",
        uploadedBy: "Admin Tier",
        role: "System User",
        initials: "AD",
        date: "05 Aug 2025",
    },
];

const PresentationModel = ({
    open,
    onClose,
}) => {

    const [attachments, setAttachments] =
        useState(initialAttachments);

    const columns = useMemo(
        () => [
            {
                accessorKey: "id",
                header: "SR. NO.",
                cell: ({ row }) => (
                    <span className="font-semibold text-gray-300">
                        {String(row.original.id).padStart(2, "0")}
                    </span>
                ),
            },

            {
                accessorKey: "name",
                header: "FILE INFORMATION",

                cell: ({ row }) => (
                    <div className="flex items-center gap-4 py-2">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-inverse">
                            <FileText
                                size={20}
                                className="text-primary"
                            />
                        </div>

                        <div>
                            <p className="text-sm font-bold text-dark m-0">
                                {row.original.name}
                            </p>

                            <p className="text-xs text-gray-400 m-0">
                                {row.original.size} · PDF Document
                            </p>
                        </div>

                    </div>
                ),
            },

            {
                accessorKey: "uploadedBy",
                header: "UPLOADED BY",

                cell: ({ row }) => (
                    <div className="flex items-center gap-3 my-auto">


                        <div className="flex h-9 w-9 items-center m-0 justify-center rounded-full bg-primary-clarity/30 text-[11px] font-bold text-primary">
                            {row.original.initials}
                        </div>

                        <div>

                            <p className="text-sm font-semibold text-dark m-0">
                                {row.original.uploadedBy}
                            </p>

                            <p className="text-[10px] m-0 uppercase tracking-wide text-gray-400">
                                {row.original.role}
                            </p>

                        </div>

                    </div>
                ),
            },

            {
                accessorKey: "date",
                header: "UPLOADED ON",

                cell: ({ row }) => (
                    <span className="text-sm font-medium text-dark">
                        {row.original.date}
                    </span>
                ),
            },

            {
                id: "actions",
                header: "ACTION",

                cell: ({ row }) => (
                    <div className="flex items-center gap-2">

                        <button
                            onClick={() => console.log("Approve", row.original)}
                            className="flex h-9 w-9 items-center justify-center rounded-full text-primary bg-gray-100 hover:bg-green-100 hover:text-green-600"
                        >
                            <Plus size={16} />
                        </button>

                        <button
                            onClick={() => console.log("Delete", row.original)}
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-danger hover:bg-red-100"
                        >
                            <Trash2 size={16} />
                        </button>

                    </div>
                ),
            },
        ],
        []
    );
    if (!open) return null;

    return (
        <>
            <div
                className="fixed inset-0 bg-black/40 z-40"
                onClick={onClose}
            />

            <div className="fixed inset-0 z-50 flex items-center justify-center p-6">

                <div
                    className="flex w-full max-w-4xl max-h-[90vh] flex-col rounded-[28px] bg-white shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >

                    {/* Header - stays fixed */}
                    <div className="flex items-center justify-between px-8 pt-7 pb-5">

                        <div>
                            <h2 className="text-xl font-extrabold text-primary">
                                Presentation Details
                            </h2>

                            <p className="mt-1 text-sm text-gray-600">
                                Manage and review event media files
                            </p>
                        </div>

                        <div className="flex items-center gap-3">

                            <button className="flex items-center gap-2 rounded-xl border border-primary-clarity/40 px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-primary hover:bg-light">
                                <Upload size={15} />
                                Upload
                            </button>

                            <button className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-white shadow-sm hover:opacity-90">
                                <ShieldCheck size={15} />
                                Approval
                            </button>

                            <button
                                onClick={onClose}
                                className="ml-1 flex h-8 w-8 items-center justify-center text-gray-400 hover:text-gray-600"
                            >
                                <X size={20} />
                            </button>

                        </div>

                    </div>

                    {/* Scrollable body */}
                    <div className="flex-1 overflow-y-auto px-8">

                        {/* Pending review banner */}
                        <div className="mb-6 flex items-center gap-3 rounded-2xl bg-primary-lighest px-5 py-3.5">

                            <span className="flex items-center gap-2 rounded-full bg-danger-lighter px-4 py-1 text-[11px] font-bold uppercase tracking-wide text-danger-active border border-danger-clarity">
                                <span className="h-1.5 w-1.5 rounded-full bg-danger-active" />
                                Pending Review
                            </span>

                            <p className="text-sm text-danger-light my-auto">
                                Awaiting final verification from the administrative tier. Estimated review: 2-4 hours.
                            </p>

                        </div>

                        {/* Table */}
                        <div className="pb-4">

                            <TableComponent
                                columns={columns}
                                data={attachments}
                                tableData={attachments}
                                paginationSize={10}
                                defaultSorting={[
                                    {
                                        id: "id",
                                        desc: false,
                                    },
                                ]}
                            />

                        </div>

                        {/* Empty state - additional versions */}
                        <div className="mb-6 flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-200 bg-primary-lighest py-6">

                            <Archive
                                size={35}
                                className="text-gray-300"
                            />

                            <p className="text-sm text-gray-600 m-0">
                                No additional versions found for this event
                            </p>

                        </div>

                        {/* Security protocols note */}
                        <div className="mb-6 flex items-start gap-4 rounded-2xl bg-primary-inverse p-6 my-auto border border-primary-clarity">

                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-clarity">
                                <ShieldCheck
                                    size={16}
                                    className="text-primary"
                                />
                            </div>

                            <div>

                                <div className="mb-1.5 flex items-center gap-2 my-auto">
                                    <p className="text-sm font-bold text-primary m-0">
                                        Enterprise Security Protocols
                                    </p>

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

                    {/* Footer - stays fixed */}
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
        </>
    )
}

export default PresentationModel;
