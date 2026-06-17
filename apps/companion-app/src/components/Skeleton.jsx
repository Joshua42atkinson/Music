import React from 'react';

// Reusable skeleton loading components
export const Skeleton = ({ className, style }) => (
  <div
    className={`animate-pulse bg-gray-700 rounded ${className || ''}`}
    style={style}
  />
);

export const TextSkeleton = ({ lines = 3, className }) => (
  <div className={`space-y-2 ${className || ''}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        className={`${i === lines - 1 ? 'w-3/4' : 'w-full'} h-4`}
      />
    ))}
  </div>
);

export const CardSkeleton = ({ className }) => (
  <div className={`rounded-lg border border-gray-700 p-4 ${className || ''}`}>
    <Skeleton className="w-12 h-12 mb-3" />
    <Skeleton className="w-3/4 h-4 mb-2" />
    <Skeleton className="w-full h-3" />
  </div>
);

export const ButtonSkeleton = ({ className }) => (
  <Skeleton
    className={`h-10 w-24 rounded-lg ${className || ''}`}
  />
);

export const AvatarSkeleton = ({ size = 40, className }) => (
  <Skeleton
    className={`${className || ''}`}
    style={{ width: size, height: size, borderRadius: '50%' }}
  />
);

export const ProgressSkeleton = ({ className }) => (
  <div className={`space-y-2 ${className || ''}`}>
    <Skeleton className="w-16 h-4" />
    <Skeleton className="w-full h-2 rounded-full" />
    <Skeleton className="w-24 h-3" />
  </div>
);

export const ListSkeleton = ({ items = 3, className }) => (
  <div className={`space-y-3 ${className || ''}`}>
    {Array.from({ length: items }).map((_, i) => (
      <div key={i} className="flex items-center space-x-3">
        <Skeleton className="w-8 h-8 rounded" />
        <div className="flex-1 space-y-2">
          <Skeleton className="w-3/4 h-4" />
          <Skeleton className="w-1/2 h-3" />
        </div>
      </div>
    ))}
  </div>
);

export const DashboardSkeleton = () => (
  <div className="space-y-6">
    {/* Header skeleton */}
    <div className="flex justify-between items-start">
      <div>
        <Skeleton className="w-64 h-10 mb-2" />
        <Skeleton className="w-96 h-5" />
      </div>
      <ProgressSkeleton />
    </div>
    
    {/* Content grid skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left column */}
      <div className="lg:col-span-2 space-y-6">
        <CardSkeleton className="h-48" />
        <CardSkeleton className="h-64" />
      </div>
      
      {/* Right column */}
      <div className="space-y-6">
        <CardSkeleton className="h-32" />
        <CardSkeleton className="h-48" />
      </div>
    </div>
  </div>
);

export default Skeleton;
