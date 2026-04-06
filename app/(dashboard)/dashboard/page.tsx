import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id: string; name: string; role: string } | undefined;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name ?? 'User'}
        </h1>
        <p className="text-gray-600 mt-1">
          Manage your support tickets from this dashboard.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/tickets"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 text-blue-600 rounded-lg p-2 text-xl">🎫</div>
            <div>
              <p className="text-sm text-gray-500">All Tickets</p>
              <p className="text-lg font-semibold text-gray-900">View Tickets</p>
            </div>
          </div>
        </Link>

        <Link
          href="/tickets/new"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className="bg-green-100 text-green-600 rounded-lg p-2 text-xl">➕</div>
            <div>
              <p className="text-sm text-gray-500">Support</p>
              <p className="text-lg font-semibold text-gray-900">New Ticket</p>
            </div>
          </div>
        </Link>

        {user?.role === 'admin' && (
          <Link
            href="/admin"
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 text-purple-600 rounded-lg p-2 text-xl">⚙️</div>
              <div>
                <p className="text-sm text-gray-500">Administration</p>
                <p className="text-lg font-semibold text-gray-900">Admin Panel</p>
              </div>
            </div>
          </Link>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/tickets?status=open"
            className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
          >
            Open Tickets
          </Link>
          <Link
            href="/tickets?status=in_progress"
            className="px-4 py-2 bg-yellow-50 text-yellow-700 rounded-lg text-sm font-medium hover:bg-yellow-100 transition-colors"
          >
            In Progress
          </Link>
          <Link
            href="/tickets?priority=urgent"
            className="px-4 py-2 bg-red-50 text-red-700 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
          >
            Urgent Tickets
          </Link>
          <Link
            href="/tickets?status=closed"
            className="px-4 py-2 bg-gray-50 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
          >
            Closed Tickets
          </Link>
        </div>
      </div>
    </div>
  );
}
