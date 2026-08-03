import { useMemo, useState } from "react";
import {
    X,
    Plus,
    Paperclip,
    Download,
    Calendar,
    ClipboardCheck,
} from "lucide-react";
import { TableComponent } from "@/components/table/TableComponent";

const initialFollowUps = [
    {
        id: 1,
        createdDate: "28 Jul 2026",
        createdTime: "05:00 PM",
        managerName: "HIMANSHU SHARMA",
        initials: "HS",
        description:
            "Final venue discussion regarding floral arrangements and lighting setup.",
        followDate: "01.07.2026",
        attached: true,
    },
    {
        id: 2,
        createdDate: "25 Jul 2026",
        createdTime: "02:15 PM",
        managerName: "AMIT RAJ",
        initials: "AR",
        description:
            "Initial client inquiry regarding outdoor seating capacity and backup rain plan.",
        followDate: "29.07.2026",
        attached: false,
    },
];

const legendItems = [
    { label: "Confirm", color: "bg-green-500" },
    { label: "R Estimate", color: "bg-primary" },
    { label: "Inquiry", color: "bg-blue-400" },
    { label: "Cancel", color: "bg-red-500" },
];

const ChatBoxModel = ({
    open,
    onClose,
}) => {

    const [followUps, setFollowUps] =
        useState(initialFollowUps);

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
                accessorKey: "createdDate",
                header: "CREATED DATE",

                cell: ({ row }) => (
                    <div>
                        <p className="text-sm font-bold text-dark m-0">
                            {row.original.createdDate}
                        </p>

                        <p className="text-xs text-gray-400 m-0">
                            {row.original.createdTime}
                        </p>
                    </div>
                ),
            },

            {
                accessorKey: "managerName",
                header: "MANAGER NAME",

                cell: ({ row }) => (
                    <div className="flex items-center gap-3">

                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-white">
                            {row.original.initials}
                        </div>

                        <p className="text-sm font-bold uppercase text-dark m-0">
                            {row.original.managerName}
                        </p>

                    </div>
                ),
            },

            {
                accessorKey: "description",
                header: "DESCRIPTION",

                cell: ({ row }) => (
                    <p className="max-w-sm text-sm text-dark-light">
                        {row.original.description}
                    </p>
                ),
            },

            {
                accessorKey: "followDate",
                header: "FOLLOW DATE",

                cell: ({ row }) => (
                    <span className="flex w-fit items-center gap-2 rounded-lg bg-primary-lighest px-3 py-1.5 text-sm font-semibold text-primary">
                        <Calendar size={14} />
                        {row.original.followDate}
                    </span>
                ),
            },

            {
                id: "attach",
                header: "ATTACH",

                cell: ({ row }) => (
                    <button
                        onClick={() => console.log("Attach", row.original)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-inverse text-primary hover:bg-primary hover:text-white"
                    >
                        {row.original.attached ? (
                            <Paperclip size={16} />
                        ) : (
                            <Plus size={16} />
                        )}
                    </button>
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
                    className="flex w-full max-w-6xl max-h-[90vh] flex-col rounded-[24px] bg-white shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >

                    {/* Header - stays fixed */}
                    <div className="flex items-center justify-between border-b px-8 py-6">

                        <div className="flex items-center gap-4">

                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-inverse">
                                <ClipboardCheck
                                    size={20}
                                    className="text-primary"
                                />
                            </div>

                            <div>
                                <h2 className="text-xl  text-dark m-0">
                                    Follow-up Module
                                </h2>

                                <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-gray-500 m-0">
                                    Event Management Dashboard
                                </p>
                            </div>

                        </div>

                        <div className="flex items-center gap-5 bg-primary-inverse py-2 px-4 rounded-xl ">

                            {legendItems.map((item) => (
                                <span
                                    key={item.label}
                                    className="flex items-center gap-1.5 text-sm text-dark-light"
                                >
                                    <span
                                        className={`h-2 w-2 rounded-full ${item.color}`}
                                    />
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
                                        Sanjeev Tola
                                    </p>

                                    <span className="rounded-md bg-primary-inverse px-2.5 py-1 text-xs font-semibold text-dark-light">
                                        9825123016
                                    </span>
                                </div>
                            </div>

                            <div>
                                <p className="text-[11px] font-semibold uppercase tracking-widest text-primary-active m-0">
                                    Event Info
                                </p>

                                <div className="mt-1 flex items-center gap-2">
                                    <p className="text-sm text-dark m-0">
                                        Wedding
                                    </p>

                                    <span className="h-1 w-1 rounded-full bg-gray-300" />

                                    <p className="text-sm text-dark m-0">
                                        11 March, 2025
                                    </p>

                                    <span className="rounded-xl bg-primary-inverse px-3 py-1.2 text-[10px] font-bold uppercase tracking-wide text-primary">
                                        Outdoor
                                    </span>
                                </div>
                            </div>

                        </div>

                        <button className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-wide text-white shadow-sm hover:opacity-90">
                            <Plus size={15} />
                            Add Item
                        </button>

                    </div>

                    {/* Scrollable body */}
                    <div className="flex-1 overflow-y-auto px-8">

                        <TableComponent
                            columns={columns}
                            data={followUps}
                            tableData={followUps}
                            paginationSize={10}
                            defaultSorting={[
                                {
                                    id: "id",
                                    desc: false,
                                },
                            ]}
                        />

                        <div className="py-4 text-center">
                            <p className="text-xs uppercase tracking-widest italic text-gray-500">
                                End of recent follow-ups
                            </p>
                        </div>

                    </div>

                    {/* Footer - stays fixed */}
                    <div className="flex items-center justify-end gap-3 border-t border-primary-clarity px-8 py-6">

                        <button className="flex items-center gap-2 rounded-lg border border-primary-clarity px-6 py-3 text-xs font-semibold uppercase tracking-wide text-dark hover:bg-light">
                            <Download size={15} />
                            Export PDF
                        </button>

                        <button
                            onClick={onClose}
                            className="rounded-lg bg-primary-inverse px-8 py-3 text-xs font-bold uppercase tracking-widest text-primary hover:bg-primary hover:text-white"
                        >
                            Close
                        </button>

                    </div>

                </div>
            </div>
        </>
    )
}

export default ChatBoxModel;
