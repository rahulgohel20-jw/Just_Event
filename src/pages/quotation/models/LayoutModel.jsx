import { useMemo, useState } from "react";
import {
    X,
    Upload,
    CheckCircle2,
    FileText,
    Image,
    Plus,
    Minus,
    Info,
    BadgeCheck,
    FileImage,
} from "lucide-react";
import { TableComponent } from "@/components/table/TableComponent";

const initialAttachments = [
    {
        id: 1,
        name: "Venue_Layout.pdf",
        type: "pdf",
        uploadedBy: "Admin",
        date: "15 Aug 2026",
    },
    {
        id: 2,
        name: "Stage_Image.jpg",
        type: "image",
        uploadedBy: "Manager",
        date: "16 Aug 2026",
    },
];

const LayoutModel = ({
    open,
    onClose,
}) => {

    const [attachments, setAttachments] =
        useState(initialAttachments);

    const columns = useMemo(
        () => [
            {
                accessorKey: "id",
                header: "NO.",
                cell: ({ row }) => (
                    <span className="font-semibold text-dark-clarity">
                        {String(row.original.id).padStart(2, "0")}
                    </span>
                ),
            },

            {
                accessorKey: "name",
                header: "FILE INFORMATION",

                cell: ({ row }) => (
                    <div className="flex items-center gap-4 py-2">

                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-inverse">
                            {row.original.type === "image" ? (
                                <FileImage
                                    size={22}
                                    className="text-primary"
                                />
                            ) : (
                                <FileText
                                    size={22}
                                    className="text-gray-600"
                                />
                            )}
                        </div>

                        <div>
                            <p className="font-semibold uppercase text-dark m-0">
                                {row.original.name}
                            </p>

                            <p className="text-[9px] text-gray-400 uppercase m-0">
                                {row.original.type === "image"
                                    ? "PNG IMAGE · 24 MB"
                                    : "PDF DOCUMENT · 11 MB"}
                            </p>
                        </div>

                    </div>
                ),
            },

            {
                accessorKey: "uploadedBy",
                header: "UPLOADER",

                cell: ({ row }) => (
                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                            {row.original.uploadedBy
                                .substring(0, 2)
                                .toUpperCase()}
                        </div>

                        <div>

                            <p className="font-semibold uppercase m-0">
                                {row.original.uploadedBy}
                            </p>

                            <p className="text-[11px] uppercase text-gray-400 m-0">
                                {row.original.uploadedBy === "Admin"
                                    ? "System Admin"
                                    : "Project Lead"}
                            </p>

                        </div>

                    </div>
                ),
            },

            {
                accessorKey: "date",
                header: "DATE",

                cell: ({ row }) => (
                    <span className="font-medium">
                        {row.original.date}
                    </span>
                ),
            },

            {
                id: "actions",
                header: "ACTIONS",

                cell: ({ row }) => (
                    <div className="flex items-center gap-3">

                        <button
                            onClick={() => console.log("Approve", row.original)}
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600 hover:bg-green-200"
                        >
                            <Plus size={18} />
                        </button>

                        <button
                            onClick={() => console.log("Reject", row.original)}
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-500 hover:bg-red-200"
                        >
                            <Minus size={18} />
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
                    className="flex w-full max-w-6xl max-h-[90vh] flex-col rounded-2xl bg-white shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >

                    {/* Header - stays fixed */}
                    <div className="flex items-center justify-between border-b px-6 py-5">

                        <div>

                            <h2 className="text-xl font-bold text-primary">
                                Layout Details
                            </h2>

                            <p className="text-xs text-gray-500">
                                DOCUMENT MANAGEMENT
                            </p>


                        </div>
                        <div className="flex flex-col gap-5 p-4 lg:flex-row lg:items-center lg:justify-between">

                            <div className="flex items-center gap-2">

                                <button className="flex items-center gap-2 rounded-xl uppercase px-5 py-2.5 text-xs font-medium text-primary border border-primary-clarity bg-light">
                                    <Upload size={16} />
                                    Upload
                                </button>

                                <button className="flex items-center gap-2 rounded-xl uppercase bg-primary px-5 py-2.5 text-xs font-medium text-light">
                                    <BadgeCheck size={16} />
                                    Approval
                                </button>

                            </div>
                            <button
                                onClick={onClose}
                            >
                                <X size={18} />
                            </button>

                        </div>

                    </div>

                    {/* Scrollable body - everything in the middle */}
                    <div className="flex-1 overflow-y-auto">

                        <div className="px-6 pt-6">
                            <div className="rounded-3xl bg-primary-lighest py-10 flex justify-center">

                                <div className="flex items-center gap-5 rounded-2xl border bg-light px-8 py-3 shadow-sm">

                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success-lighter">
                                        <CheckCircle2
                                            size={26}
                                            className="text-success"
                                        />

                                    </div>

                                    <div>
                                        <h2 className="text-2xl font-black tracking-wider text-primary uppercase p-0 m-0">
                                            Approved
                                        </h2>

                                        <p className="text-[11px] uppercase tracking-[3px] text-gray-400 m-0">
                                            Verification Status
                                        </p>

                                        <p className="text-[11px] uppercase tracking-[3px] text-gray-400 m-0">
                                            Confirmed
                                        </p>
                                    </div>

                                </div>

                            </div>
                        </div>

                        <div className="px-6 py-8">

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

                        <div className="px-6 pb-6 my-5">

                            <div className="flex items-center gap-4 rounded-2xl border bg-primary-lighest p-6">

                                <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-white">
                                    <Info
                                        size={18}
                                        className="text-dark-clarity"
                                    />
                                </div>

                                <p className="text-sm text-gray-700 my-auto">
                                    Viewing historical layout attachments. Only Admin roles can
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
        </>
    )
}

export default LayoutModel;
