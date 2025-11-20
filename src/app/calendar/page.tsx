'use client';

import { useState, useCallback, useMemo } from 'react';
import { Calendar, dateFnsLocalizer, View } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const locales = {
    'en-US': enUS,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

interface CalendarEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
    description?: string;
    type: 'family' | 'personal' | 'task';
}

export default function CalendarPage() {
    const [view, setView] = useState<View>('month');
    const [date, setDate] = useState(new Date());

    // Mock events - replace with actual API call
    const events: CalendarEvent[] = useMemo(() => [
        {
            id: '1',
            title: 'Family Dinner',
            start: new Date(2024, 2, 20, 19, 0),
            end: new Date(2024, 2, 20, 21, 0),
            description: 'Monthly family dinner',
            type: 'family',
        },
        {
            id: '2',
            title: 'Clean Kitchen - Task Due',
            start: new Date(2024, 2, 22, 10, 0),
            end: new Date(2024, 2, 22, 11, 0),
            type: 'task',
        },
        {
            id: '3',
            title: 'Movie Night',
            start: new Date(2024, 2, 25, 20, 0),
            end: new Date(2024, 2, 25, 23, 0),
            type: 'family',
        },
    ], []);

    const handleSelectSlot = useCallback((slotInfo: any) => {
        console.log('Selected slot:', slotInfo);
        // Open create event dialog
    }, []);

    const handleSelectEvent = useCallback((event: CalendarEvent) => {
        console.log('Selected event:', event);
        // Open event details dialog
    }, []);

    const eventStyleGetter = (event: CalendarEvent) => {
        const backgroundColor = event.type === 'family'
            ? '#3b82f6'
            : event.type === 'task'
                ? '#f59e0b'
                : '#8b5cf6';

        return {
            style: {
                backgroundColor,
                borderRadius: '5px',
                opacity: 0.8,
                color: 'white',
                border: '0px',
                display: 'block',
            },
        };
    };

    return (
        <div className="min-h-screen bg-background py-10">
            <div className="container">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Family Calendar</h1>
                        <p className="text-muted-foreground mt-1">
                            Manage family events and tasks
                        </p>
                    </div>
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        New Event
                    </Button>
                </div>

                <Card className="p-6">
                    <div className="calendar-wrapper" style={{ height: '700px' }}>
                        <Calendar
                            localizer={localizer}
                            events={events}
                            startAccessor="start"
                            endAccessor="end"
                            view={view}
                            onView={setView}
                            date={date}
                            onNavigate={setDate}
                            onSelectSlot={handleSelectSlot}
                            onSelectEvent={handleSelectEvent}
                            selectable
                            eventPropGetter={eventStyleGetter}
                            popup
                            views={['month', 'week', 'day', 'agenda']}
                        />
                    </div>
                </Card>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="h-4 w-4 rounded bg-blue-500" />
                            <div>
                                <div className="font-medium">Family Events</div>
                                <div className="text-sm text-muted-foreground">Shared with all members</div>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="h-4 w-4 rounded bg-amber-500" />
                            <div>
                                <div className="font-medium">Task Deadlines</div>
                                <div className="text-sm text-muted-foreground">Task due dates</div>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="h-4 w-4 rounded bg-purple-500" />
                            <div>
                                <div className="font-medium">Personal Events</div>
                                <div className="text-sm text-muted-foreground">Your private events</div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            <style jsx global>{`
        .rbc-calendar {
          font-family: inherit;
        }
        .rbc-header {
          padding: 10px 3px;
          font-weight: 600;
        }
        .rbc-today {
          background-color: hsl(var(--primary) / 0.1);
        }
        .rbc-event {
          padding: 2px 5px;
          font-size: 0.875rem;
        }
        .rbc-toolbar button {
          color: hsl(var(--foreground));
          border: 1px solid hsl(var(--border));
          background: hsl(var(--background));
          padding: 0.5rem 1rem;
          border-radius: 0.375rem;
        }
        .rbc-toolbar button:hover {
          background: hsl(var(--accent));
        }
        .rbc-toolbar button.rbc-active {
          background: hsl(var(--primary));
          color: hsl(var(--primary-foreground));
        }
      `}</style>
        </div>
    );
}
