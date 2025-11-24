
'use client';

import { useState, useCallback, useEffect } from 'react';
import { Calendar, dateFnsLocalizer, View, SlotInfo } from 'react-big-calendar';
import { format } from 'date-fns/format';
import { parse } from 'date-fns/parse';
import { startOfWeek } from 'date-fns/startOfWeek';
import { getDay } from 'date-fns/getDay';
import { enUS } from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

import { api, endpoints } from '@/lib/api';
import { CreateCalendarEventDialog } from '@/components/family/CreateCalendarEventDialog';
import { CalendarExport } from '@/components/family/CalendarExport';


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
    event_id: string;
    title: string;
    start: Date;
    end: Date;
    description?: string;
    event_type: 'family' | 'personal' | 'task';
    location?: string;
    created_by_name?: string;
}

const EVENT_TYPE_COLORS = {
    family: '#3b82f6',      // Blue
    task: '#f59e0b',        // Amber
    personal: '#8b5cf6',    // Purple
};

const EVENT_TYPE_LABELS = {
    family: 'Family Events',
    task: 'Task Deadlines',
    personal: 'Personal Events',
};

export default function CalendarPage() {
    const [view, setView] = useState<View>(() => {
        // Persist view preference in localStorage
        if (typeof window !== 'undefined') {
            return (localStorage.getItem('calendarView') as View) || 'month';
        }
        return 'month';
    });
    const [date, setDate] = useState(new Date());
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(true);

    const [familyId, setFamilyId] = useState<string>('');

    interface Family {
        family_id: string;
        name: string;
    }

    // Fetch events from API
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                // Get family ID from user's families
                const familiesResponse = await api.get<Family[]>(endpoints.family.myFamilies);
                if (familiesResponse.data.length > 0) {
                    const firstFamily = familiesResponse.data[0];
                    setFamilyId(firstFamily.family_id);

                    // Fetch calendar events
                    const eventsResponse = await api.get(
                        `${endpoints.calendar.events}?family_id = ${firstFamily.family_id} `
                    );

                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const formattedEvents = eventsResponse.data.map((event: any) => ({
                        ...event,
                        start: new Date(event.start_time),
                        end: new Date(event.end_time),
                    }));

                    setEvents(formattedEvents);
                }
            } catch (error) {
                console.error('Failed to fetch events:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    // Persist view preference
    const handleViewChange = useCallback((newView: View) => {
        setView(newView);
        if (typeof window !== 'undefined') {
            localStorage.setItem('calendarView', newView);
        }
    }, []);



    // Handle drag and drop event rescheduling


    // Handle event resize


    // Handle slot selection (create new event)
    const handleSelectSlot = useCallback((slotInfo: SlotInfo) => {
        // This will be handled by the CreateCalendarEventDialog
        console.log('Selected slot:', slotInfo);
    }, []);

    // Handle event click (view/edit event)
    const handleSelectEvent = useCallback((event: CalendarEvent) => {
        // TODO: Open event details dialog
        console.log('Selected event:', event);
    }, []);

    // Color coding by event type
    const eventStyleGetter = useCallback((event: CalendarEvent) => {
        const backgroundColor = EVENT_TYPE_COLORS[event.event_type] || '#6b7280';

        return {
            style: {
                backgroundColor,
                borderRadius: '5px',
                opacity: 0.9,
                color: 'white',
                border: '0px',
                display: 'block',
                fontWeight: 500,
            },
        };
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-background py-10">
                <div className="container">
                    <Skeleton className="h-12 w-[300px] mb-8" />
                    <Skeleton className="h-[700px] w-full" />
                </div>
            </div>
        );
    }

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
                    <div className="flex gap-2">
                        <CalendarExport familyId={familyId} />
                        <CreateCalendarEventDialog
                            onEventCreated={() => window.location.reload()}
                        />
                    </div>
                </div>



                <Card className="p-6">
                    <div className="calendar-wrapper" style={{ height: '700px' }}>
                        <Calendar
                            localizer={localizer}
                            events={events}
                            startAccessor="start"
                            endAccessor="end"
                            view={view}
                            onView={handleViewChange}
                            date={date}
                            onNavigate={setDate}
                            onSelectSlot={handleSelectSlot}
                            onSelectEvent={handleSelectEvent}

                            selectable
                            eventPropGetter={eventStyleGetter}
                            popup
                            views={['month', 'week', 'day', 'agenda']}
                            tooltipAccessor={(event: CalendarEvent) =>
                                `${event.title}${event.location ? ` @ ${event.location}` : ''} `
                            }
                        />
                    </div>
                </Card>

                {/* Event type legend */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(EVENT_TYPE_LABELS).map(([type, label]) => (
                        <Card key={type} className="p-4">
                            <div className="flex items-center gap-3">
                                <div
                                    className="h-4 w-4 rounded"
                                    style={{ backgroundColor: EVENT_TYPE_COLORS[type as keyof typeof EVENT_TYPE_COLORS] }}
                                />
                                <div>
                                    <div className="font-medium">{label}</div>
                                    <div className="text-sm text-muted-foreground">
                                        {events.filter(e => e.event_type === type).length} events
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* View toggle buttons */}
                <div className="mt-6 flex gap-2 justify-center">
                    {(['month', 'week', 'day', 'agenda'] as View[]).map((v) => (
                        <Button
                            key={v}
                            variant={view === v ? 'default' : 'outline'}
                            onClick={() => handleViewChange(v)}
                            size="sm"
                        >
                            {v.charAt(0).toUpperCase() + v.slice(1)}
                        </Button>
                    ))}
                </div>
            </div>

            <style jsx global>{`
    .rbc - calendar {
    font - family: inherit;
}
        .rbc - header {
    padding: 10px 3px;
    font - weight: 600;
}
        .rbc - today {
    background - color: hsl(var(--primary) / 0.1);
}
        .rbc - event {
    padding: 2px 5px;
    font - size: 0.875rem;
}
        .rbc - toolbar button {
    color: hsl(var(--foreground));
    border: 1px solid hsl(var(--border));
    background: hsl(var(--background));
    padding: 0.5rem 1rem;
    border - radius: 0.375rem;
}
        .rbc - toolbar button:hover {
    background: hsl(var(--accent));
}
        .rbc - toolbar button.rbc - active {
    background: hsl(var(--primary));
    color: hsl(var(--primary - foreground));
}
        .rbc - addons - dnd.rbc - addons - dnd - resizable {
    cursor: move;
}
        .rbc - addons - dnd - dragging {
    opacity: 0.5;
}
`}</style>
        </div>
    );
}
