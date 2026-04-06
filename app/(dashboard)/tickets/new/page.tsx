import { TicketForm } from '@/components/tickets/TicketForm';
import Link from 'next/link';

export default function NewTicketPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link href="/tickets" className="text-sm text-blue-600 hover:underline">
          ← Back to tickets
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Create New Ticket</h1>
        <p className="text-gray-500 text-sm mt-1">
          Describe your issue and we&apos;ll get back to you as soon as possible.
        </p>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <TicketForm />
      </div>
    </div>
  );
}
