import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { UserRepository } from '@/server/repositories/UserRepository';
import { RoleUpdateForm } from '@/components/admin/RoleUpdateForm';
import { Navbar } from '@/components/layout/Navbar';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminUserPage({ params }: PageProps) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');
  const sessionUser = session.user as { id: string; role: string };
  if (sessionUser.role !== 'admin') redirect('/dashboard');

  const userRepo = new UserRepository();
  const user = await userRepo.findById(id);
  if (!user) redirect('/admin');

  const u = user as unknown as { _id: { toString(): string }; name: string; email: string; role: string; createdAt: Date };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <Link href="/admin" className="text-sm text-blue-600 hover:underline">
          ← Back to Admin
        </Link>
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h1 className="text-xl font-bold text-gray-900">User Management</h1>
          <div className="space-y-1">
            <p className="font-medium text-gray-900">{u.name}</p>
            <p className="text-sm text-gray-500">{u.email}</p>
            <p className="text-xs text-gray-400">
              Member since {new Date(u.createdAt).toLocaleDateString()}
            </p>
          </div>
          <RoleUpdateForm userId={u._id.toString()} currentRole={u.role} />
        </div>
      </main>
    </div>
  );
}
