import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { TicketService } from '@/server/services/TicketService';
import { TicketList } from '@/components/tickets/TicketList';
import { TicketFilters } from '@/components/tickets/TicketFilters';
import Link from 'next/link';
import { ITicket, TicketStatus, TicketPriority, TicketCategory } from '@/types';
import { Suspense } from 'react';

interface SearchParams {
  status?: string;
  priority?: string;
  category?: string;
  search?: string;
  page?: string;
}

export default async function TicketsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  const session = await getServerSession(authOptions);
  const user = session!.user as { id: string; role: string };

  const ticketService = new TicketService();

  const filters = {
    status: resolvedSearchParams.status as TicketStatus | undefined,
    priority: resolvedSearchParams.priority as TicketPriority | undefined,
    category: resolvedSearchParams.category as TicketCategory | undefined,
    search: resolvedSearchParams.search,
    page: resolvedSearchParams.page ? parseInt(resolvedSearchParams.page) : 1,
    limit: 20,
  };

  const result = await ticketService.getTickets(filters, user.id, user.role);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tickets</h1>
          <p className="text-gray-500 text-sm mt-1">{result.total} total tickets</p>
        </div>
        <Link
          href="/tickets/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          New Ticket
        </Link>
      </div>

      <Suspense fallback={<div>Loading filters...</div>}>
        <TicketFilters />
      </Suspense>

      <TicketList
        tickets={result.data as unknown as ITicket[]}
        total={result.total}
        page={result.page}
        totalPages={result.totalPages}
      />
    </div>
  );
}
