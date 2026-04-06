'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'waiting_for_customer', label: 'Waiting for Customer' },
  { value: 'closed', label: 'Closed' },
];

const priorityOptions = [
  { value: '', label: 'All Priorities' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

const categoryOptions = [
  { value: '', label: 'All Categories' },
  { value: 'technical', label: 'Technical' },
  { value: 'billing', label: 'Billing' },
  { value: 'general', label: 'General' },
  { value: 'feature_request', label: 'Feature Request' },
  { value: 'bug', label: 'Bug' },
];

export function TicketFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set('page', '1');
    router.push(`/tickets?${params.toString()}`);
  }

  function clearFilters() {
    router.push('/tickets');
  }

  return (
    <div className="flex flex-wrap gap-3 items-end">
      <div className="w-40">
        <Select
          options={statusOptions}
          value={searchParams.get('status') ?? ''}
          onChange={(e) => updateFilter('status', e.target.value)}
          label="Status"
        />
      </div>
      <div className="w-36">
        <Select
          options={priorityOptions}
          value={searchParams.get('priority') ?? ''}
          onChange={(e) => updateFilter('priority', e.target.value)}
          label="Priority"
        />
      </div>
      <div className="w-44">
        <Select
          options={categoryOptions}
          value={searchParams.get('category') ?? ''}
          onChange={(e) => updateFilter('category', e.target.value)}
          label="Category"
        />
      </div>
      <div className="flex-1 min-w-48">
        <Input
          label="Search"
          placeholder="Search tickets..."
          defaultValue={searchParams.get('search') ?? ''}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              updateFilter('search', (e.target as HTMLInputElement).value);
            }
          }}
        />
      </div>
      <Button variant="secondary" onClick={clearFilters} size="sm">
        Clear
      </Button>
    </div>
  );
}
