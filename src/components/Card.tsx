// src/components/Card.tsx
import React from "react";

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string; // Allow additional classes
}

const Card: React.FC<CardProps> = ({ title, children, className = "" }) => {
  return (
    <div className={`bg-white rounded-lg shadow p-4 sm:p-6 ${className}`}>
      {title && (
        <h2 className="text-lg font-semibold mb-3 text-neutral-dark">
          {title}
        </h2>
      )}
      <div>{children}</div>
    </div>
  );
};
export default Card;
