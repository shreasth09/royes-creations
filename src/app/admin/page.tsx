import React from 'react';
import AdminDashboardClient from './AdminDashboardClient';

export const metadata = {
  title: 'Merchant Admin Dashboard | Royes Creations',
  description: 'Manage Jaipur orders, verify UPI payments, and update products.',
};

export const revalidate = 0;

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-stone-100/60 pb-20">
      <AdminDashboardClient />
    </div>
  );
}
