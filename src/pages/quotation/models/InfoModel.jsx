import { X, Calendar, Clock, Download } from "lucide-react";

const historyItems = [
    {
        id: 1,
        name: "Jane Doe",
        initials: "JD",
        action: "Update Logistics",
        date: "Oct 24, 2024",
        time: "09:14 AM",
        description:
            "Updated catering logistics to include premium beverage package and extended service hours for the gala dinner.",
    },
    {
        id: 2,
        name: "Marc Smith",
        initials: "MS",
        action: "Structural Review",
        date: "Oct 23, 2024",
        time: "04:30 PM",
        description:
            "Revised venue floor plan following structural walkthrough; adjusted AV equipment rental costs.",
    },
    {
        id: 3,
        name: "Alice Rogers",
        initials: "AR",
        action: "Creation",
        date: "Oct 22, 2024",
        time: "11:05 AM",
        description:
            "Initial quotation creation based on preliminary client brief for the 2025 Tech Summit.",
    },
];

const InfoModel = ({
    open,
    onClose,
    referenceId = "Q-2024-0012",
}) => {

    if (!open) return null;

    return (
        <>
            <div
                className="fixed inset-0 bg-black/40 z-40"
                onClick={onClose}
            />

            <div className="fixed inset-0 z-50 flex items-center justify-center p-6">

                <div
                    className="flex w-full max-w-2xl max-h-[90vh] flex-col rounded-[24px] bg-white shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >

                    {/* Header - stays fixed */}
                    <div className="flex items-start justify-between border-b px-8 py-6">

                        <div>
                            <h2 className="text-lg text-dark">
                                Quotation Update History
                            </h2>

                            <p className="mt-1 text-sm text-gray-600 m-0">
                                Detailed log of modifications for reference {referenceId}
                            </p>
                        </div>

                        <button
                            onClick={onClose}
                            className="flex h-8 w-8 items-center justify-center text-gray-600"
                        >
                            <X size={20} />
                        </button>

                    </div>

                    {/* Scrollable timeline body */}
                    <div className="flex-1 overflow-y-auto px-8 py-6">

                        <div className="relative">

                            {historyItems.map((item, index) => (
                                <div
                                    key={item.id}
                                    className="relative flex gap-4 pb-8 last:pb-0"
                                >

                                    {index !== historyItems.length - 1 && (
                                        <span className="absolute left-[19px] top-10 h-full w-px bg-primary-clarity/30" />
                                    )}

                                    <div className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-inverse text-xs font-bold text-primary">
                                        {item.initials}
                                    </div>

                                    <div className="flex-1">

                                        <div className="flex flex-wrap items-center justify-between gap-2">

                                            <div>
                                                <p className="text-sm font-bold text-dark m-0">
                                                    {item.name}
                                                </p>

                                                <p className="text-xs font-semibold text-primary m-0">
                                                    {item.action}
                                                </p>
                                            </div>

                                            <span className="flex items-center gap-2 rounded-full bg-primary-inverse px-3 py-1.5 text-xs font-semibold text-gray-500 ">
                                                <Calendar size={13} className="text-primary-light" />
                                                {item.date}
                                               <p className="m-0"> •</p>
                                                {item.time}
                                            </span>

                                        </div>

                                        <div className="mt-3 rounded-2xl border border-gray-100 bg-light px-5 py-4">
                                            <p className="text-sm leading-relaxed text-daark-light">
                                                {item.description}
                                            </p>
                                        </div>

                                    </div>

                                </div>
                            ))}

                        </div>

                    </div>

                    

                    {/* Footer - stays fixed */}
                    <div className="flex items-center justify-end gap-3 bg-primary-inverse px-8 py-6 rounded-b-2xl">

                        <button
                            onClick={onClose}
                            className="rounded-lg bg-light px-7 py-3 text-xs font-bold uppercase tracking-widest text-primary shadow-sm hover:bg-gray-50"
                        >
                            Close Details
                        </button>

                        <button className="rounded-lg bg-primary px-7 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-sm">
                            Download Log (PDF)
                        </button>

                    </div>

                </div>
            </div>
        </>
    )
}

export default InfoModel;
