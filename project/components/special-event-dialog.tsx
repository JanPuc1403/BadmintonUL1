'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import type { SpecialEvent } from '@/lib/types';

type Props = {
  onEventAdd: (event: SpecialEvent) => void;
  username: string;
  existingDates: string[];
};

export function SpecialEventDialog({ onEventAdd, username, existingDates }: Props) {
  const [date, setDate] = useState<Date>();
  const [type, setType] = useState<'tournament' | 'training'>('training');
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = () => {
    if (date) {
      const formattedDate = format(date, 'yyyy-MM-dd');
      onEventAdd({
        date: formattedDate,
        type,
        createdBy: username,
      });
      setIsOpen(false);
      setDate(undefined);
      setType('training');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <CalendarIcon className="mr-2 h-4 w-4" />
          Add Special Event
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Special Event</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={(date) => {
                const formatted = format(date, 'yyyy-MM-dd');
                return existingDates.includes(formatted);
              }}
              className="rounded-md border"
            />
          </div>
          <div className="grid gap-2">
            <Select value={type} onValueChange={(value: 'tournament' | 'training') => setType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tournament">Tournament</SelectItem>
                <SelectItem value="training">Extra Training</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleSubmit} disabled={!date}>
            Add Event
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}