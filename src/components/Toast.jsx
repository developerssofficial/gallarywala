import React from "react";
import { usePins } from "../context/PinContext";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";

export const ToastContainer = () => {
  const { toasts } = usePins();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className="toast-item">
          {toast.type === "success" && (
            <CheckCircle2 size={18} color="#10b981" />
          )}
          {toast.type === "error" && (
            <AlertCircle size={18} color="#ef4444" />
          )}
          {toast.type === "info" && (
            <Info size={18} color="#00e5ff" />
          )}
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
};
