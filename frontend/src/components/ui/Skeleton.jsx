import React from 'react';

export const SkeletonCard = () => (
  <div className="bg-surface border border-border rounded-xl overflow-hidden card-animate">
    <div className="h-52 shimmer-bg" />
    <div className="p-4 space-y-3">
      <div className="h-4 shimmer-bg rounded w-3/4" />
      <div className="h-3 shimmer-bg rounded w-1/2" />
      <div className="pt-3 border-t border-border flex justify-between">
        <div className="h-4 shimmer-bg rounded w-16" />
        <div className="h-4 shimmer-bg rounded w-20" />
      </div>
    </div>
  </div>
);

export const SkeletonCatalogCard = () => (
  <div className="bg-surface border border-border rounded-xl overflow-hidden p-5 space-y-4 card-animate">
    <div className="flex justify-between items-start">
      <div className="space-y-2 flex-1">
        <div className="h-5 shimmer-bg rounded w-2/3" />
        <div className="h-3 shimmer-bg rounded w-1/3" />
      </div>
      <div className="h-6 shimmer-bg rounded-full w-16" />
    </div>
    <div className="h-3 shimmer-bg rounded w-full" />
    <div className="h-3 shimmer-bg rounded w-3/4" />
    <div className="flex gap-2 pt-2">
      <div className="h-8 shimmer-bg rounded-lg flex-1" />
      <div className="h-8 shimmer-bg rounded-lg w-10" />
    </div>
  </div>
);

export const SkeletonRow = () => (
  <div className="flex items-center gap-4 p-4 bg-surface border border-border rounded-xl card-animate">
    <div className="w-12 h-12 shimmer-bg rounded-lg flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-4 shimmer-bg rounded w-1/3" />
      <div className="h-3 shimmer-bg rounded w-1/4" />
    </div>
    <div className="h-8 shimmer-bg rounded-lg w-20" />
  </div>
);
