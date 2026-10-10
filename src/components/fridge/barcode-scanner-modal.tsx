"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Camera,
  X,
  ScanBarcode,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Plus,
  Zap,
} from "lucide-react";

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onItemsDetected: (items: Array<{ name: string; category: string; quantity: number; unit: string; expiryDate: string }>) => void;
}

const COMMON_SCANNED_GROCERIES = [
  { barcode: "8901030894512", name: "Amul Pasteurised Whole Milk (1L)", category: "dairy", qty: 1, unit: "litres", days: 3 },
  { barcode: "8901233024881", name: "Fresh Baby Spinach (Palak)", category: "produce", qty: 250, unit: "g", days: 2 },
  { barcode: "8901725181223", name: "Whole Wheat Sandwich Bread", category: "pantry", qty: 1, unit: "pack", days: 4 },
  { barcode: "8902080004128", name: "Fresh Paneer Block (200g)", category: "dairy", qty: 200, unit: "g", days: 4 },
  { barcode: "8906007281903", name: "Heirloom Red Tomatoes", category: "produce", qty: 4, unit: "items", days: 3 },
  { barcode: "8901058852331", name: "Greek Style Plain Yogurt", category: "dairy", qty: 400, unit: "g", days: 5 },
  { barcode: "8908001123490", name: "Organic Crisp Gala Apples", category: "produce", qty: 6, unit: "items", days: 7 },
  { barcode: "8902011223344", name: "Cooked Brown Basmati Rice", category: "pantry", qty: 350, unit: "g", days: 2 },
];

export function BarcodeScannerModal({ isOpen, onClose, onItemsDetected }: BarcodeScannerModalProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [detectedItems, setDetectedItems] = useState<any[]>([]);
  const [scanningMode, setScanningMode] = useState<"barcode" | "receipt">("barcode");

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setDetectedItems([]);
      return;
    }

    startCamera();
    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraActive(true);
        }
      } else {
        setCameraError("Camera API not accessible in this environment. You can use the Quick Simulation Scanner below.");
      }
    } catch {
      setCameraError("Camera permission not granted or device camera unavailable. Use Quick Simulation below.");
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const handleSimulateScan = (itemIndex?: number) => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      const chosen =
        itemIndex !== undefined
          ? COMMON_SCANNED_GROCERIES[itemIndex]
          : COMMON_SCANNED_GROCERIES[Math.floor(Math.random() * COMMON_SCANNED_GROCERIES.length)];

      const expiry = new Date(Date.now() + chosen.days * 24 * 3600 * 1000).toISOString().split("T")[0];

      const newItem = {
        name: chosen.name,
        category: chosen.category,
        quantity: chosen.qty,
        unit: chosen.unit,
        expiryDate: expiry,
      };

      setDetectedItems((prev) => [...prev, newItem]);
    }, 700);
  };

  const handleSimulateReceiptScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      // Simulate receipt parsing 3 grocery items at once
      const items = [
        { name: "Fresh Baby Spinach (Palak)", category: "produce", quantity: 250, unit: "g", expiryDate: new Date(Date.now() + 2 * 86400000).toISOString().split("T")[0] },
        { name: "Fresh Paneer Block (200g)", category: "dairy", quantity: 200, unit: "g", expiryDate: new Date(Date.now() + 3 * 86400000).toISOString().split("T")[0] },
        { name: "Organic Crisp Gala Apples", category: "produce", quantity: 6, unit: "items", expiryDate: new Date(Date.now() + 6 * 86400000).toISOString().split("T")[0] },
      ];
      setDetectedItems((prev) => [...prev, ...items]);
    }, 1200);
  };

  const handleSaveToFridge = () => {
    if (detectedItems.length === 0) return;
    onItemsDetected(detectedItems);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-hidden border border-zinc-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/70">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <Camera className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900">
                Camera & Barcode Quick Logger
              </h2>
              <p className="text-[11px] text-zinc-500">
                Point at grocery barcode or supermarket receipt to log automatically
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-zinc-400 hover:bg-zinc-200 hover:text-zinc-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Viewfinder Area */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Mode Switcher */}
          <div className="flex rounded-full bg-zinc-100 p-1 text-xs font-semibold">
            <button
              onClick={() => setScanningMode("barcode")}
              className={`flex-1 py-1.5 rounded-full transition flex items-center justify-center gap-1.5 ${
                scanningMode === "barcode" ? "bg-white text-zinc-900 shadow-2xs" : "text-zinc-600"
              }`}
            >
              <ScanBarcode className="h-3.5 w-3.5" />
              Barcode Scanner
            </button>
            <button
              onClick={() => setScanningMode("receipt")}
              className={`flex-1 py-1.5 rounded-full transition flex items-center justify-center gap-1.5 ${
                scanningMode === "receipt" ? "bg-white text-zinc-900 shadow-2xs" : "text-zinc-600"
              }`}
            >
              <Camera className="h-3.5 w-3.5" />
              Receipt Photo OCR
            </button>
          </div>

          {/* Camera Frame */}
          <div className="relative aspect-4/3 rounded-2xl bg-zinc-900 overflow-hidden flex items-center justify-center border border-zinc-800">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${cameraActive ? "block" : "hidden"}`}
            />

            {!cameraActive && (
              <div className="text-center p-6 space-y-2">
                <Camera className="h-10 w-10 mx-auto text-zinc-600" />
                <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                  {cameraError || "Initializing camera..."}
                </p>
              </div>
            )}

            {/* Viewfinder Target Overlay */}
            <div className="absolute inset-8 border-2 border-dashed border-emerald-400/70 rounded-2xl pointer-events-none flex items-center justify-center">
              <div className="w-full h-0.5 bg-emerald-400/90 shadow-[0_0_8px_#34d399] animate-pulse" />
            </div>

            {isScanning && (
              <div className="absolute inset-0 bg-emerald-950/40 backdrop-blur-xs flex items-center justify-center">
                <div className="p-3 bg-white rounded-full shadow-lg flex items-center gap-2 text-xs font-bold text-emerald-800">
                  <RefreshCw className="h-4 w-4 animate-spin text-emerald-600" />
                  <span>Decoding barcode...</span>
                </div>
              </div>
            )}
          </div>

          {/* Simulation Trigger Buttons for Instant Testing */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-zinc-500">
              <span>Quick Test Simulators:</span>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                Instant Recognition
              </span>
            </div>

            {scanningMode === "barcode" ? (
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => handleSimulateScan(0)}
                  className="p-2 border rounded-xl hover:bg-zinc-50 text-left transition font-medium text-zinc-800 flex items-center gap-2"
                >
                  <Zap className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                  <span className="truncate">Scan Amul Milk</span>
                </button>
                <button
                  onClick={() => handleSimulateScan(1)}
                  className="p-2 border rounded-xl hover:bg-zinc-50 text-left transition font-medium text-zinc-800 flex items-center gap-2"
                >
                  <Zap className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  <span className="truncate">Scan Fresh Spinach</span>
                </button>
                <button
                  onClick={() => handleSimulateScan(3)}
                  className="p-2 border rounded-xl hover:bg-zinc-50 text-left transition font-medium text-zinc-800 flex items-center gap-2"
                >
                  <Zap className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                  <span className="truncate">Scan Paneer Block</span>
                </button>
                <button
                  onClick={() => handleSimulateScan(4)}
                  className="p-2 border rounded-xl hover:bg-zinc-50 text-left transition font-medium text-zinc-800 flex items-center gap-2"
                >
                  <Zap className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                  <span className="truncate">Scan Tomatoes</span>
                </button>
              </div>
            ) : (
              <button
                onClick={handleSimulateReceiptScan}
                className="w-full p-2.5 bg-zinc-900 text-white rounded-xl text-xs font-semibold hover:bg-zinc-800 transition flex items-center justify-center gap-2"
              >
                <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                Snap Supermarket Receipt & OCR Extract Groceries
              </button>
            )}
          </div>

          {/* Detected Items List */}
          {detectedItems.length > 0 && (
            <div className="space-y-2 border-t border-zinc-100 pt-3">
              <div className="flex items-center justify-between text-xs font-semibold text-zinc-800">
                <span>Recognized Items ({detectedItems.length}):</span>
                <button
                  onClick={() => setDetectedItems([])}
                  className="text-zinc-400 hover:text-zinc-600 font-normal text-[11px]"
                >
                  Clear
                </button>
              </div>

              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {detectedItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-semibold text-emerald-950">{item.name}</p>
                      <p className="text-[10px] text-emerald-700">
                        {item.quantity} {item.unit} • Expires {item.expiryDate}
                      </p>
                    </div>
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-100 bg-zinc-50 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:text-zinc-900"
          >
            Cancel
          </button>
          <button
            disabled={detectedItems.length === 0}
            onClick={handleSaveToFridge}
            className="px-5 py-2.5 bg-emerald-700 text-white rounded-full text-xs font-semibold hover:bg-emerald-800 transition shadow-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Plus className="h-3.5 w-3.5" />
            Add {detectedItems.length} {detectedItems.length === 1 ? "Item" : "Items"} to Virtual Fridge
          </button>
        </div>
      </div>
    </div>
  );
}
