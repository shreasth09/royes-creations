import React, { Suspense } from 'react';
import TrackOrderClient from './TrackOrderClient';

export const metadata = {
  title: 'Track Order | Royes Creations (Jaipur)',
  description: 'Track your Royes Creations order status live using your Order ID and Mobile number.',
};

export default function TrackPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <Suspense fallback={<div className="text-center py-12 text-sm text-stone-500">Loading Order Tracker...</div>}>
        <TrackOrderClient />
      </Suspense>
    </div>
  );
}
