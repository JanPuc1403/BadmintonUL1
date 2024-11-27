'use client';

import { users } from '@/lib/users';

export function UserColorsChart() {
  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {users.map((user) => (
        <div key={user.username} className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: user.color }}
          />
          <span className="text-sm font-medium">{user.username}</span>
        </div>
      ))}
    </div>
  );
}