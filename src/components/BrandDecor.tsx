import React from 'react';

interface BrandDecorProps {
  showTealCircle?: boolean;
}

export const BrandDecor: React.FC<BrandDecorProps> = ({ showTealCircle = true }) => {
  return (
    <>
      {showTealCircle && (
        <div
          className="pointer-events-none absolute -top-24 -right-24 sm:-top-32 sm:-right-32 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-[#10a394] opacity-90 transition-all duration-700"
          style={{
            clipPath: 'circle(50% at 50% 50%)',
          }}
        />
      )}
      {/* Background subtle radial gradient */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(16,163,148,0.08),_transparent_60%)]" />
    </>
  );
};
