import { useState } from "react";
import { X, Printer, FileText, Rows3 } from "lucide-react";

const printOptions = [
    {
        id: "event-wise",
        title: "Event Wise",
        description: "Aggregate all functions into a single document.",
        icon: FileText,
    },
    {
        id: "function-wise",
        title: "Function Wise",
        description: "Generate individual pages for each function.",
        icon: Rows3,
    },
];

const PrintModel = ({
    open,
    onClose,
    onPrint,
}) => {

    const [selectedOption, setSelectedOption] =
        useState("event-wise");

    if (!open) return null;

    const handlePrint = () => {
        if (onPrint) onPrint(selectedOption);
    };

    return (
        <>
            <div
                className="fixed inset-0 bg-black/40 z-40"
                onClick={onClose}
            />

            <div className="fixed inset-0 z-50 flex items-center justify-center p-6">

                <div
                    className="flex w-full max-w-md flex-col overflow-hidden rounded-[24px] bg-white shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >

                    {/* Header */}
                    <div className="flex items-center justify-between px-8 pt-7 pb-2">

                        <h2 className="text-lg text-primary m-0 ">
                            Select Printing Option
                        </h2>

                        <button
                            onClick={onClose}
                            className="flex h-8 w-8 items-center justify-center text-dark-light"
                        >
                            <X size={20} />
                        </button>

                    </div>

                    {/* Options */}
                    <div className="flex flex-col gap-4 px-8 py-6">

                        {printOptions.map((option) => {
                            const Icon = option.icon;
                            const isSelected = selectedOption === option.id;

                            return (
                                <button
                                    key={option.id}
                                    onClick={() => setSelectedOption(option.id)}
                                    className={`flex items-start justify-between rounded-xl border-2 px-6 py-5 text-left transition-colors ${
                                        isSelected
                                            ? "border-primary bg-white"
                                            : "border-gray-200 bg-white hover:border-gray-300"
                                    }`}
                                >

                                    <div className="flex items-start gap-4">

                                        <span
                                            className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                                                isSelected
                                                    ? "border-primary"
                                                    : "border-gray-300 border-2"
                                            }`}
                                        >
                                            {isSelected && (
                                                <span className="h-full w-full rounded-full bg-primary" />
                                            )}
                                        </span>

                                        <div>
                                            <p className="text-base font-bold text-dark m-0">
                                                {option.title}
                                            </p>

                                            <p className="mt-1 text-sm text-gray-500 m-0">
                                                {option.description}
                                            </p>
                                        </div>

                                    </div>

                                    <Icon
                                        size={20}
                                        className={
                                            isSelected
                                                ? "text-primary"
                                                : "text-gray-300"
                                        }
                                    />

                                </button>
                            );
                        })}

                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-6 bg-primary-inverse px-8 py-6">

                        <button
                            onClick={onClose}
                            className="text-sm font-semibold text-dark-light hover:text-gray-700"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-bold text-white shadow-sm hover:opacity-90"
                        >
                            <Printer size={16} />
                            Print
                        </button>

                    </div>

                </div>
            </div>
        </>
    )
}

export default PrintModel;
