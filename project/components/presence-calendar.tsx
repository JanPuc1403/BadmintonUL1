'use client';

import { useState, useEffect } from 'react';
import { format, addDays, startOfToday, getDay } from 'date-fns';
import { Trophy, Dumbbell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { UserColorsChart } from '@/components/user-colors-chart';
import { SpecialEventDialog } from '@/components/special-event-dialog';
import { users } from '@/lib/users';
import { useToast } from '@/hooks/use-toast';
import type { User, Presence, SpecialEvent } from '@/lib/types';

const ALLOWED_DAYS = [1, 3, 4]; // Monday (1), Wednesday (3), Thursday (4)

export function Calendar({ currentUser }: { currentUser: User }) {
  const [presence, setPresence] = useState<Presence>({});
  const [specialEvents, setSpecialEvents] = useState<SpecialEvent[]>([]);
  const { toast } = useToast();
  const today = startOfToday();

  // Generate dates for the next 2 weeks
  const dates = Array.from({ length: 14 }, (_, i) => addDays(today, i));

  useEffect(() => {
    const storedPresence = localStorage.getItem('presence');
    const storedEvents = localStorage.getItem('specialEvents');
    if (storedPresence) {
      setPresence(JSON.parse(storedPresence));
    }
    if (storedEvents) {
      setSpecialEvents(JSON.parse(storedEvents));
    }
  }, []);

  const isDateClickable = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const isSpecialEvent = specialEvents.some(event => event.date === dateStr);
    return ALLOWED_DAYS.includes(getDay(date)) || isSpecialEvent;
  };

  const getEventType = (dateStr: string) => {
    return specialEvents.find(event => event.date === dateStr);
  };

  const togglePresence = (date: Date) => {
    if (!isDateClickable(date)) {
      toast({
        title: 'Not Available',
        description: 'You can only mark presence for Monday, Wednesday, Thursday, or special events',
        variant: 'destructive',
      });
      return;
    }

    const dateStr = format(date, 'yyyy-MM-dd');
    setPresence((prev) => {
      const newPresence = { ...prev };
      if (!newPresence[dateStr]) {
        newPresence[dateStr] = [];
      }

      const index = newPresence[dateStr].indexOf(currentUser.username);
      if (index === -1) {
        newPresence[dateStr] = [...newPresence[dateStr], currentUser.username];
      } else {
        newPresence[dateStr] = newPresence[dateStr].filter(
          (name) => name !== currentUser.username
        );
      }

      localStorage.setItem('presence', JSON.stringify(newPresence));
      return newPresence;
    });
  };

  const handleAddSpecialEvent = (event: SpecialEvent) => {
    setSpecialEvents((prev) => {
      const newEvents = [...prev, event];
      localStorage.setItem('specialEvents', JSON.stringify(newEvents));
      return newEvents;
    });
    toast({
      title: 'Success',
      description: `Added ${event.type} for ${format(new Date(event.date), 'MMM d, yyyy')}`,
    });
  };

  const resetPresence = () => {
    localStorage.removeItem('presence');
    localStorage.removeItem('specialEvents');
    setPresence({});
    setSpecialEvents([]);
    toast({
      title: 'Success',
      description: 'Presence data has been reset',
    });
  };

  const getExistingDates = () => {
    return specialEvents.map(event => event.date);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          {currentUser.isAdmin && (
            <Button variant="destructive" onClick={resetPresence}>
              Reset All Presence Data
            </Button>
          )}
          <SpecialEventDialog
            onEventAdd={handleAddSpecialEvent}
            username={currentUser.username}
            existingDates={getExistingDates()}
          />
        </div>
        <div className="text-sm text-muted-foreground">
          Available days: Monday, Wednesday, Thursday + Special Events
        </div>
      </div>

      <div className="grid grid-cols-7 gap-4">
        {dates.map((date) => {
          const dateStr = format(date, 'yyyy-MM-dd');
          const presentUsers = presence[dateStr] || [];
          const isClickable = isDateClickable(date);
          const event = getEventType(dateStr);

          return (
            <div
              key={dateStr}
              className={`border rounded-lg p-4 space-y-2 ${
                isClickable ? 'bg-card' : 'bg-muted'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">
                  {format(date, 'EEE, MMM d')}
                </div>
                {event && (
                  <div className="text-blue-500">
                    {event.type === 'tournament' ? (
                      <Trophy className="h-4 w-4" />
                    ) : (
                      <Dumbbell className="h-4 w-4" />
                    )}
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-1">
                {users.map((user) => {
                  const isPresent = presentUsers.includes(user.username);
                  return (
                    <div
                      key={user.username}
                      className={`w-3 h-3 rounded-full transition-opacity ${
                        isPresent ? 'opacity-100' : 'opacity-20'
                      }`}
                      style={{ backgroundColor: user.color }}
                    />
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => togglePresence(date)}
                disabled={!isClickable}
              >
                {presentUsers.includes(currentUser.username)
                  ? 'Cancel'
                  : 'Mark Present'}
              </Button>
            </div>
          );
        })}
      </div>

      <div className="space-y-4">
        <Separator />
        <div className="text-sm text-center text-muted-foreground">
          Team Members
        </div>
        <UserColorsChart />
      </div>
    </div>
  );
}