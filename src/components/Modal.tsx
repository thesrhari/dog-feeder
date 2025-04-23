// src/components/Modal.tsx
import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4"
      onClick={onClose} // Close on backdrop click
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative bg-white rounded-lg shadow-xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-200">
          <h3
            id="modal-title"
            className="text-lg font-medium leading-6 text-gray-900"
          >
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
            aria-label="Close modal"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
