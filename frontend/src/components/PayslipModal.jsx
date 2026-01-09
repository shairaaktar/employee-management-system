


import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { X, Download } from "lucide-react";
import toast from "react-hot-toast";


pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`;

export default function PayslipModal({ pdfUrl, onClose }) {
  const [file, setFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  useEffect(() => {
    let abort = false;
    async function loadPDF() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(pdfUrl, {
          mode: "cors",
          cache: "no-store",
          headers: { "Cache-Control": "no-cache" },
        });
        if (!res.ok) throw new Error("PDF not found");
        const blob = await res.blob();
        if (!abort) setFile(blob);
      } catch (err) {
        console.error("PDF load error:", err);
        if (!abort) setError("Failed to load PDF");
      } finally {
        if (!abort) setLoading(false);
      }
    }
    if (pdfUrl) loadPDF();
    return () => {
      abort = true;
      setFile(null);
      setNumPages(null);
    };
  }, [pdfUrl]);

 
  const handleClose = () => {
    setFile(null);
    setNumPages(null);
    onClose();
  };

 
  const handleDownload = () => {
    if (!file) return;
    const blobUrl = window.URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = pdfUrl.split("/").pop();
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(blobUrl);
    toast.success("Downloading payslip...");
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="relative bg-white rounded-lg shadow-xl w-[90%] md:w-[70%] lg:w-[50%] max-h-[90%] overflow-hidden flex flex-col">
       
        <div className="flex justify-between items-center px-5 py-3 border-b">
          <h2 className="font-semibold text-lg">Payslip Preview</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownload}
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
            >
              <Download size={16} /> Download
            </button>
            <button
              onClick={handleClose}
              className="p-2 rounded-full hover:bg-gray-100 transition"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        
        <div className="flex-1 overflow-y-auto flex justify-center items-center bg-gray-50 p-4">
          {loading && (
            <p className="text-gray-500 text-center">Loading payslip...</p>
          )}
          {error && <p className="text-red-500 text-center">{error}</p>}
          {!loading && !error && file && (
            <Document
              file={file}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              loading={<p>Preparing document...</p>}
            >
              {Array.from(new Array(numPages), (el, index) => (
                <Page
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                  width={500}
                />
              ))}
            </Document>
          )}
        </div>
      </div>
    </div>
  );
}
