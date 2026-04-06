'use client';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

export function Navbar() {
  const { data: session } = useSession();
  const user = session?.user as
    | { id: string; name: string; email: string; role: string }
    | undefined;

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/dashboard" className="text-xl font-bold text-blue-600">
          SupportDesk
        </Link>
        <div className="flex items-center gap-4">
          {user && (
            <>
              <span className="text-sm text-gray-600">{user.name}</span>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium capitalize">
                {user.role}
              </span>
              {user.role === 'admin' && (
                <Link href="/admin" className="text-sm text-gray-600 hover:text-gray-900">
                  Admin
                </Link>
              )}
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="text-sm text-gray-600 hover:text-red-600 transition-colors"
              >
                Sign out
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
