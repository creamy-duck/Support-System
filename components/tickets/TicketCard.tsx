import Link from 'next/link';
import { ITicket } from '@/types';
import { Badge } from '@/components/ui/Badge';

interface TicketCardProps {
  ticket: ITicket;
}

export function TicketCard({ ticket }: TicketCardProps) {
  const createdByName =
    typeof ticket.createdBy === 'object' ? ticket.createdBy.name : 'Unknown';

  return (
    <Link href={`/tickets/${ticket._id}`} className="block">
      <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow hover:border-blue-200">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-medium text-gray-900 line-clamp-1">{ticket.title}</h3>
          <div className="flex gap-2 flex-shrink-0">
            <Badge value={ticket.priority} variant="priority" />
            <Badge value={ticket.status} variant="status" />
          </div>
        </div>
        <p className="text-sm text-gray-500 line-clamp-2 mb-3">{ticket.description}</p>
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>
            By {createdByName} · {ticket.category.replace('_', ' ')}
          </span>
          <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </Link>
  );
}
