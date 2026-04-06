'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ITicket, TicketStatus } from '@/types';
import { Badge } from '@/components/ui/Badge';

interface TicketDetailProps {
  ticket: ITicket;
  supportUsers?: { _id: string; name: string }[];
}

const statusOptions = [
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'waiting_for_customer', label: 'Waiting for Customer' },
  { value: 'closed', label: 'Closed' },
];

export function TicketDetail({ ticket, supportUsers = [] }: TicketDetailProps) {
  const { data: session } = useSession();
  const user = session?.user as { id: string; role: string } | undefined;
  const router = useRouter();
  const [updating, setUpdating] = useState(false);

  const canManage = user?.role === 'support' || user?.role === 'admin';

  async function updateStatus(status: TicketStatus) {
    setUpdating(true);
    await fetch(`/api/tickets/${ticket._id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    setUpdating(false);
    router.refresh();
  }

  async function assignTicket(assigneeId: string | null) {
    setUpdating(true);
    await fetch(`/api/tickets/${ticket._id}/assign`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assigneeId }),
    });
    setUpdating(false);
    router.refresh();
  }

  const assignedName =
    typeof ticket.assignedTo === 'object' && ticket.assignedTo
      ? (ticket.assignedTo as { name: string }).name
      : null;

  const createdByName =
    typeof ticket.createdBy === 'object'
      ? (ticket.createdBy as { name: string; email: string }).name
      : 'Unknown';

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{ticket.title}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge value={ticket.status} variant="status" />
            <Badge value={ticket.priority} variant="priority" />
            <span className="text-sm text-gray-500 capitalize">
              {ticket.category.replace('_', ' ')}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Created by</p>
          <p className="font-medium">{createdByName}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Assigned to</p>
          <p className="font-medium">{assignedName ?? 'Unassigned'}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Created</p>
          <p className="font-medium">{new Date(ticket.createdAt).toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="font-medium text-gray-700 mb-2">Description</h3>
        <p className="text-gray-600 whitespace-pre-wrap">{ticket.description}</p>
      </div>

      {canManage && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
          <h3 className="font-medium text-gray-700">Management</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Update Status
              </label>
              <div className="flex gap-2">
                <select
                  defaultValue={ticket.status}
                  onChange={(e) => updateStatus(e.target.value as TicketStatus)}
                  disabled={updating}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {supportUsers.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assign To
                </label>
                <div className="flex gap-2">
                  <select
                    defaultValue={
                      typeof ticket.assignedTo === 'object' && ticket.assignedTo
                        ? (ticket.assignedTo as { _id: string })._id
                        : ticket.assignedTo?.toString() ?? ''
                    }
                    onChange={(e) => assignTicket(e.target.value || null)}
                    disabled={updating}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Unassigned</option>
                    {supportUsers.map((u) => (
                      <option key={u._id} value={u._id}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
