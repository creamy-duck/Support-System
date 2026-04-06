import { ITicket } from '@/types';
import { TicketCard } from './TicketCard';
import Link from 'next/link';

interface TicketListProps {
  tickets: ITicket[];
  total: number;
  page: number;
  totalPages: number;
}

export function TicketList({ tickets, total, page, totalPages }: TicketListProps) {
  if (tickets.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">🎫</div>
        <p className="text-gray-500 text-lg">No tickets found</p>
        <p className="text-gray-400 text-sm mt-1">
          Try adjusting your filters or{' '}
          <Link href="/tickets/new" className="text-blue-600 hover:underline">
            create a new ticket
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>Showing {tickets.length} of {total} tickets</span>
        <span>Page {page} of {totalPages}</span>
      </div>
      <div className="space-y-3">
        {tickets.map((ticket) => (
          <TicketCard key={ticket._id} ticket={ticket} />
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`?page=${p}`}
              className={`px-3 py-1 rounded text-sm ${
                p === page
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 border hover:bg-gray-50'
              }`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
