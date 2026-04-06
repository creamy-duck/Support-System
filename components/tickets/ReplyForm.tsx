'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';

interface ReplyFormProps {
  ticketId: string;
}

export function ReplyForm({ ticketId }: ReplyFormProps) {
  const { data: session } = useSession();
  const user = session?.user as { id: string; role: string } | undefined;
  const router = useRouter();
  const [content, setContent] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const canAddInternal = user?.role === 'support' || user?.role === 'admin';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    setError('');

    const res = await fetch(`/api/tickets/${ticketId}/replies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, isInternal }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || 'Failed to post reply');
      return;
    }

    setContent('');
    setIsInternal(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your reply..."
        rows={4}
        required
        minLength={1}
        maxLength={10000}
      />
      <div className="flex items-center justify-between">
        {canAddInternal && (
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={isInternal}
              onChange={(e) => setIsInternal(e.target.checked)}
              className="rounded border-gray-300"
            />
            Internal note (not visible to customer)
          </label>
        )}
        <div className={canAddInternal ? '' : 'ml-auto'}>
          <Button type="submit" loading={loading} disabled={!content.trim()}>
            Post Reply
          </Button>
        </div>
      </div>
    </form>
  );
}
