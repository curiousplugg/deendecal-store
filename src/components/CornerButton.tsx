'use client';

import React from 'react';

interface CornerButtonProps {
  onClick: () => void;
}

export default function CornerButton({ onClick }: CornerButtonProps) {
  return (
    <button
      className="corner-discount-button triangle-visible"
      onClick={onClick}
      aria-label="Get 20% off discount"
    >
      <div className="corner-discount-button-content">
        <span>20% OFF</span>
      </div>
    </button>
  );
}

