import { useEffect } from "react";
import { CustomModal } from "@/components/custom-modal/CustomModal";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

// Injected once — forces the modal frame (header/body/footer) into a flex
// column capped at the viewport height, with ONLY the body scrolling.
// Done as raw CSS (rather than relying on CustomModal's own `styles` prop
// passthrough) so it works regardless of antd version / how CustomModal
// merges its internal defaults with whatever we pass in.
const STYLE_ID = "report-pdf-viewer-modal-style";
if (typeof document !== "undefined" && !document.getElementById(STYLE_ID)) {
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    .report-pdf-viewer-modal .ant-modal-content {
      display: flex !important;
      flex-direction: column !important;
      max-height: 88vh !important;
      overflow: hidden !important;
      padding: 0 !important;
    }
    .report-pdf-viewer-modal .ant-modal-body {
      flex: 1 1 auto !important;
      min-height: 0 !important;
      overflow-y: auto !important;
      overflow-x: hidden !important;
      padding: 0 !important;
    }
    .report-pdf-viewer-modal .ant-modal-footer,
    .report-pdf-viewer-modal .ant-modal-header {
      flex-shrink: 0 !important;
    }
  `;
  document.head.appendChild(style);
}

/**
 * Inline PDF preview modal — shows a loading state while the PDF fetches,
 * then the full toolbar viewer (zoom, page nav, download, print, thumbnails).
 * Reused wherever a generated report needs to be previewed instead of
 * opened via window.open in a new tab.
 *
 * Modal frame is capped to the viewport and centered; only the body
 * (the PDF viewer area) scrolls — header and footer always stay visible.
 */
const ReportPdfViewerModal = ({
  open,
  onClose,
  title = "Report Preview",
  pdfUrl,
  onWhatsAppShare, // optional — pass a handler to show the "Share on WhatsApp" button
}) => {
  const pdfPlugin = defaultLayoutPlugin();

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title={title}
      width={900}
      centered
      maskClosable={false}
      keyboard={false}
      className="report-pdf-viewer-modal"
      style={{ maxWidth: "95vw" }}
      footer={
        <div className="flex justify-end gap-2">
         
          {onWhatsAppShare && (
            <button
              onClick={onWhatsAppShare}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Share on WhatsApp
            </button>
          )}
        </div>
      }
    >
      <div className="w-full" style={{ height: "70vh" }}>
        {pdfUrl ? (
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
            <Viewer
              fileUrl={pdfUrl}
              plugins={[pdfPlugin]}
              renderLoader={(percentages) => (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  <p className="mt-4 text-gray-600 font-medium">
                    Loading PDF... {Math.round(percentages)}%
                  </p>
                </div>
              )}
            />
          </Worker>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-gray-600 font-medium">Preparing report...</p>
          </div>
        )}
      </div>
    </CustomModal>
  );
};

export { ReportPdfViewerModal };