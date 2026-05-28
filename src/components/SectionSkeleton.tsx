import React from 'react';

interface SectionSkeletonProps {
  hasGrid?: boolean;
  gridCols?: number;
  height?: string;
}

export const SectionSkeleton: React.FC<SectionSkeletonProps> = ({
  hasGrid = true,
  gridCols = 3,
  height = 'h-64'
}) => {
  return (
    <div className="py-20 relative overflow-hidden bg-slate-50/5 dark:bg-gray-950/2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 animate-pulse">
        {/* Header Shimmer */}
        <div className="flex flex-col items-center justify-center text-center mb-12">
          <div className="h-4 w-24 bg-slate-200 dark:bg-white/10 rounded-full mb-3" />
          <div className="h-8 w-64 bg-slate-200 dark:bg-white/10 rounded-lg mb-2" />
          <div className="h-3 w-96 bg-slate-200 dark:bg-white/10 rounded-md" />
        </div>

        {/* Dynamic Card Grids Shimmer */}
        {hasGrid ? (
          <div className={`grid grid-cols-1 md:grid-cols-${gridCols} gap-8`}>
            {Array.from({ length: gridCols }).map((_, idx) => (
              <div
                key={idx}
                className="glass-card p-6 border border-slate-200/50 dark:border-white/5 bg-slate-100/10 dark:bg-white/2 rounded-2xl flex flex-col gap-4"
              >
                <div className={`w-full ${height} bg-slate-200/50 dark:bg-white/5 rounded-xl`} />
                <div className="h-4 w-3/4 bg-slate-200/50 dark:bg-white/5 rounded" />
                <div className="h-3 w-1/2 bg-slate-200/50 dark:bg-white/5 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className={`w-full ${height} bg-slate-200/30 dark:bg-white/5 rounded-2xl`} />
        )}
      </div>
    </div>
  );
};

export default SectionSkeleton;
