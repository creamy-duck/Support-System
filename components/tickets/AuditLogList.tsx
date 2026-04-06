import { IAuditLog, IUser } from '@/types';

interface AuditLogListProps {
  logs: IAuditLog[];
}

const actionLabels: Record<string, string> = {
  created: 'Ticket created',
  status_changed: 'Status changed',
  assigned: 'Assigned to',
  unassigned: 'Unassigned',
  closed: 'Ticket closed',
  reply_added: 'Reply added',
};

export function AuditLogList({ logs }: AuditLogListProps) {
  if (logs.length === 0) {
    return <p className="text-center text-gray-400 py-4 text-sm">No audit log entries</p>;
  }

  return (
    <div className="space-y-2">
      {logs.map((log) => {
        const performer =
          typeof log.performedBy === 'object' ? (log.performedBy as IUser).name : 'Unknown';
        return (
          <div key={log._id} className="flex items-start gap-3 text-sm py-2 border-b border-gray-100 last:border-0">
            <div className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
            <div className="flex-1">
              <span className="font-medium text-gray-700">{performer}</span>
              {' · '}
              <span className="text-gray-600">{actionLabels[log.action] ?? log.action}</span>
              {log.oldValue && log.newValue && (
                <span className="text-gray-500">
                  {' '}
                  <span className="line-through">{log.oldValue}</span>
                  {' → '}
                  <span className="font-medium">{log.newValue}</span>
                </span>
              )}
              {!log.oldValue && log.newValue && (
                <span className="text-gray-500"> ({log.newValue})</span>
              )}
            </div>
            <span className="text-xs text-gray-400 flex-shrink-0">
              {new Date(log.createdAt).toLocaleString()}
            </span>
          </div>
        );
      })}
    </div>
  );
}
