import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { UserService } from '@/server/services/UserService';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');
  const sessionUser = session.user as { id: string; role: string };
  if (sessionUser.role !== 'admin') redirect('/dashboard');

  const userService = new UserService();
  const users = await userService.getUsers('admin');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-gray-500 text-sm mt-1">Manage users and system settings</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Users</h2>
              <span className="text-sm text-gray-500">{users.length} total</span>
            </div>
            <div className="divide-y divide-gray-100">
              {users.map((user) => {
                const u = user as unknown as { _id: { toString(): string }; name: string; email: string; role: string; createdAt: Date };
                return (
                  <div key={u._id.toString()} className="px-6 py-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{u.name}</p>
                      <p className="text-sm text-gray-500">{u.email}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge value={u.role} variant="role" />
                      <span className="text-xs text-gray-400">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </span>
                      <Link
                        href={`/admin/users/${u._id.toString()}`}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Manage
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
