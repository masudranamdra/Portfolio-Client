import React from 'react';

export const SkeletonCard = () => {
  return (
    <div className="glass-card p-6 min-h-[300px] flex flex-col justify-between animate-pulse">
      <div>
        <div className="w-full h-40 bg-slate-200 dark:bg-white/5 rounded-xl mb-4" />
        <div className="w-2/3 h-6 bg-slate-200 dark:bg-white/5 rounded mb-2" />
        <div className="w-full h-4 bg-slate-200 dark:bg-white/5 rounded mb-1" />
        <div className="w-5/6 h-4 bg-slate-200 dark:bg-white/5 rounded" />
      </div>
      <div className="flex gap-2 mt-4">
        <div className="w-16 h-8 bg-slate-200 dark:bg-white/5 rounded" />
        <div className="w-16 h-8 bg-slate-200 dark:bg-white/5 rounded" />
      </div>
    </div>
  );
};

export const SkeletonGrid = ({ count = 3, cols = 3 }: { count?: number; cols?: number }) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  }[cols] || 'grid-cols-1 md:grid-cols-3';

  return (
    <div className={`grid gap-6 ${gridCols}`}>
      {Array.from({ length: count }).map((_, idx) => (
        <SkeletonCard key={idx} />
      ))}
    </div>
  );
};

export const SkeletonRow = () => {
  return (
    <tr className="animate-pulse border-b border-slate-200 dark:border-white/5">
      <td className="p-4"><div className="w-32 h-4 bg-slate-200 dark:bg-white/5 rounded" /></td>
      <td className="p-4"><div className="w-16 h-4 bg-slate-200 dark:bg-white/5 rounded" /></td>
      <td className="p-4"><div className="w-24 h-4 bg-slate-200 dark:bg-white/5 rounded" /></td>
      <td className="p-4"><div className="w-12 h-6 bg-slate-200 dark:bg-white/5 rounded" /></td>
      <td className="p-4 flex gap-2"><div className="w-8 h-8 bg-slate-200 dark:bg-white/5 rounded" /><div className="w-8 h-8 bg-slate-200 dark:bg-white/5 rounded" /></td>
    </tr>
  );
};

export const SkeletonTable = ({ rows = 5 }: { rows?: number }) => {
  return (
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="border-b border-slate-200 dark:border-white/10">
          <th className="p-4"><div className="w-20 h-4 bg-slate-300 dark:bg-white/10 rounded" /></th>
          <th className="p-4"><div className="w-12 h-4 bg-slate-300 dark:bg-white/10 rounded" /></th>
          <th className="p-4"><div className="w-16 h-4 bg-slate-300 dark:bg-white/10 rounded" /></th>
          <th className="p-4"><div className="w-10 h-4 bg-slate-300 dark:bg-white/10 rounded" /></th>
          <th className="p-4"><div className="w-16 h-4 bg-slate-300 dark:bg-white/10 rounded" /></th>
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, idx) => (
          <SkeletonRow key={idx} />
        ))}
      </tbody>
    </table>
  );
};
