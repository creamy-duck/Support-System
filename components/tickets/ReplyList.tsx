import { ITicketReply, IUser } from '@/types';
import { Badge } from '@/components/ui/Badge';

interface ReplyListProps {
  replies: ITicketReply[];
}

export function ReplyList({ replies }: ReplyListProps) {
  if (replies.length === 0) {
    return (
      <p className="text-center text-gray-400 py-6 text-sm">
        No replies yet. Be the first to respond!
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {replies.map((reply) => {
        const author = typeof reply.author === 'object' ? reply.author as IUser : null;
        return (
          <div
            key={reply._id}
            className={`rounded-lg p-4 ${
              reply.isInternal
                ? 'bg-amber-50 border border-amber-200'
                : 'bg-gray-50 border border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm text-gray-900">
                  {author?.name ?? 'Unknown'}
                </span>
                {author && <Badge value={author.role} variant="role" />}
                {reply.isInternal && (
                  <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                    Internal
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-400">
                {new Date(reply.createdAt).toLocaleString()}
              </span>
            </div>
            <p className="text-gray-700 text-sm whitespace-pre-wrap">{reply.content}</p>
          </div>
        );
      })}
    </div>
  );
}
