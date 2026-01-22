'use client';

import { RoleGuard } from '@/components/auth/RoleGuard';

export default function AdminPage() {
  return (
    <RoleGuard allowedRoles={['ADMIN']}>
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
        <p className="mb-4">Welcome to the protected admin area.</p>
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">System Stats</h2>
          <p>Only users with the 'ADMIN' role can see this page.</p>
        </div>
      </div>
    </RoleGuard>
  );
}
