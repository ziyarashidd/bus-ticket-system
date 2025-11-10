"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"

interface TicketReceiptProps {
  ticket:
    | {
        id: string
        agencyCode: string
        conductorName: string
        busId: string
        source: string
        destination: string
        fare: string
        seat: string
        passengerName: string
        passengerPhone: string
        createdAt: string
      }
    | any[]
  busName: string
  routeCode: string
}

export function TicketReceipt({ ticket, busName, routeCode }: TicketReceiptProps) {
  
  const receiptRef = useRef<HTMLDivElement>(null)

  const tickets = Array.isArray(ticket) ? ticket : [ticket]

  // Direct Print Function
  const handlePrint = () => {
    window.print()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    }) + ', ' + date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    })
  }

  return (
    <div className="space-y-4">
      
      <style jsx global>{`
        /* यह प्रिंटिंग CSS rules को लागू करता है जब window.print() कॉल होता है। */
        @media print {
            
            /* 1. Print Isolation FIX: body के सभी बच्चों को छिपाएं */
            /* पहले सब छिपा दें, फिर केवल .print-receipt-wrapper को दिखाएंगे */
            body * {
                visibility: hidden;
            }

            /* 2. केवल Ticket Wrapper को दिखाएं */
            .print-receipt-wrapper, .print-receipt-wrapper * {
                visibility: visible;
            }

            /* 3. Ticket Wrapper को Print Area के टॉप-लेफ्ट में सेट करें */
            .print-receipt-wrapper {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%; /* पूरी प्रिंट चौड़ाई का उपयोग करने के लिए */
                margin: 0;
                padding: 0;
                display: block !important; 
            }
            
            /* 4. Ticket Container को स्टाइल करें (सेंटर, 58mm चौड़ाई और Border Fix) */
            .print-receipt {
                width: 58mm !important;
                /* 🔑 FIX: सेंटर में लाने के लिए */
                margin: 0 auto !important; 
                box-shadow: none !important;
                /* 🔑 BORDER FIX: बॉर्डर लगाने के लिए */
                border: 2px solid #ccc !important; 
                padding: 0 !important;
            }

            /* 5. प्रिंट फोंट और कलर्स */
            body {
                margin: 0;
                padding: 0;
                font-family: 'Courier New', monospace !important;
                font-size: 10pt !important;
            }

            /* 6. बैकग्राउंड रंग, बॉर्डर और डैश लाइन को सही करें */
            .bg-yellow-50, 
            .text-blue-600, 
            .border-black, 
            .border-gray-400 {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
            
            /* डैश बॉर्डर को साफ़-साफ़ दिखाएं */
            .border-dashed {
                border-style: dashed !important;
            }

            /* 7. मल्टीपल टिकट के लिए पेज ब्रेक */
            .ticket-page {
                page-break-after: always;
                position: relative; /* For watermark positioning */
            }
            .ticket-page:last-child {
                page-break-after: auto;
            }

            /* Watermark for each ticket - Made slightly darker for better visibility */
            .ticket-page::before {
                content: "ZIYARASHID";
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) rotate(-45deg);
                font-size: 40px;
                color: rgba(0, 0, 0, 0.15); /* Increased opacity for better visibility */
                z-index: 0;
                pointer-events: none;
                font-family: inherit;
            }
        }
      `}</style>
      
      {/* 🔑 FIX: एक outer wrapper जोड़ा गया है जिसे प्रिंट में दिखाया जाएगा */}
      <div className="print-receipt-wrapper" style={{ display: 'flex', justifyContent: 'center' }}>
        <div
          ref={receiptRef}
          // Screen Tailwind classes (Note: print-receipt class handles all print styling)
          className="bg-white rounded-lg border-2 border-gray-300 shadow-lg p-0 print-receipt"
          style={{ width: "220px", fontFamily: "Courier New, monospace" }}
        >
          {tickets.map((t, idx) => (
            <div
              key={idx}
              className="p-3 border-b-2 border-dashed border-black last:border-b-0 ticket-page"
              style={{ pageBreakAfter: idx < tickets.length - 1 ? "always" : "auto" }}
            >
              {/* Ticket Content Here (Same as before) */}
              {/* Header */}
              <div className="text-center border-b-2 border-dashed border-black pb-2 mb-2">
                <div className="text-sm font-bold tracking-widest">✓ BUS TICKET ✓</div>
                <div className="text-xs text-gray-700 font-semibold mt-1">
                  Ticket {idx + 1} of {tickets.length}
                </div>
                <div className="text-xs text-gray-600 mt-1">{t?.agencyCode || "N/A"}</div>
              </div>

              {/* Route Section */}
              <div className="mb-2 pb-2 border-b border-dashed border-gray-400 text-center">
                <div className="text-xs font-bold mb-1 text-gray-800">ROUTE DETAILS</div>
                <div className="flex justify-center items-center gap-1 mb-1">
                  <span className="font-bold text-xs">{t?.source?.toUpperCase?.() || "N/A"}</span>
                  <span className="font-bold text-sm">→</span>
                  <span className="font-bold text-xs">{t?.destination?.toUpperCase?.() || "N/A"}</span>
                </div>
              </div>

              {/* Bus & Route Info */}
              <div className="mb-2 pb-2 border-b border-dashed border-gray-400 text-center text-xs space-y-0.5">
                <div>
                  <span className="font-semibold">Bus:</span>
                  <span className="font-bold ml-1">{busName}</span>
                </div>
                <div>
                  <span className="font-semibold">Route:</span>
                  <span className="font-bold ml-1">{routeCode}</span>
                </div>
                <div>
                  <span className="font-semibold">Conductor:</span>
                  <span className="font-bold ml-1">{t?.conductorName || "N/A"}</span>
                </div>
              </div>

              {/* Passenger Info */}
              <div className="mb-2 pb-2 border-b border-dashed border-gray-400 text-center text-xs space-y-0.5">
                <div className="font-bold text-gray-800 mb-1">PASSENGER</div>
                <div>
                  <span className="font-semibold text-sm">{t?.passengerName || "N/A"}</span>
                </div>
                <div className="text-gray-600 text-xs">
                  <span className="font-semibold">Ph:</span>
                  <span className="ml-1">{t?.passengerPhone || "N/A"}</span>
                </div>
              </div>

              {/* Seat Number */}
              <div className="mb-2 pb-2 border-b border-dashed border-gray-400 text-center">
                <div className="text-xs font-semibold mb-1 text-gray-800">SEAT NUMBER</div>
                <div className="text-4xl font-bold text-blue-600 tracking-wider">{t?.seat || "N/A"}</div>
              </div>

              {/* Fare Amount Box */}
              <div className="text-center border-2 border-black p-2 mb-2 bg-yellow-50 rounded">
                <div className="text-xs text-gray-700 font-semibold mb-1">FARE AMOUNT</div>
                <div className="text-3xl font-bold text-black">₹{t?.fare || "N/A"}</div>
                <div className="text-xs text-gray-600 mt-1 font-semibold">Per Passenger</div>
              </div>

              {/* Date & Time */}
              <div className="text-center text-xs mb-2 pb-2 border-b border-dashed border-gray-400">
                <div className="font-semibold text-gray-800">{t?.createdAt ? formatDate(t.createdAt) : "N/A"}</div>
              </div>

              {/* Ticket ID */}
              <div className="text-center text-xs mb-2 pb-2 border-b border-dashed border-gray-400">
                <div className="text-gray-600 mb-1 font-semibold text-xs">TICKET ID</div>
                <div className="font-mono font-bold text-xs break-all px-1">{t?.id || "N/A"}</div>
              </div>

              {/* Footer */}
              <div className="text-center text-xs text-gray-700 mt-2 pt-1 space-y-0.5">
                <div className="font-bold">✓ Thank You ✓</div>
                <div className="font-semibold">Safe Journey</div>
                <div className="text-gray-600 text-xs">Have a great trip!</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* End of .print-receipt-wrapper */}

      {/* --- Other content (No-Print Zone - .no-print class is not needed because of the new isolation logic) --- */}
      
      {tickets.length > 1 && (
        <div className="mt-6 space-y-3">
          <h3 className="font-semibold text-gray-900 text-center">Generated Tickets ({tickets.length})</h3>
          <div className="grid gap-2 max-h-96 overflow-y-auto">
            {tickets.map((t, idx) => (
              <div
                key={idx}
                className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 text-sm"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-gray-900">Ticket {idx + 1}</div>
                    <div className="text-xs text-gray-600">{t.passengerName || "N/A"}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-blue-600 font-bold">Seat: {t.seat || "N/A"}</div>
                    <div className="text-xs text-gray-600">₹{t.fare || "N/A"}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Print Button */}
      <Button
        onClick={handlePrint}
        className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold h-11"
      >
        <Printer className="w-4 h-4" />
        Print Receipt (58mm)
      </Button>
      
    </div>
  )
}