'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { api, endpoints } from '@/lib/api';
import { Plus, Loader2 } from 'lucide-react';

const calendarEventSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().optional(),
    start_time: z.string().min(1, 'Start time is required'),
    end_time: z.string().min(1, 'End time is required'),
    event_type: z.enum(['family', 'personal', 'task']),
    location: z.string().optional(),
    reminder_minutes: z.number().optional(),
});

type CalendarEventFormData = z.infer<typeof calendarEventSchema>;

interface CreateCalendarEventDialogProps {
    onEventCreated?: () => void;
    defaultDate?: Date;
}

export function CreateCalendarEventDialog({ onEventCreated, defaultDate }: CreateCalendarEventDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const form = useForm<CalendarEventFormData>({
        resolver: zodResolver(calendarEventSchema),
        defaultValues: {
            title: '',
            description: '',
            start_time: defaultDate ? defaultDate.toISOString().slice(0, 16) : '',
            end_time: defaultDate ? new Date(defaultDate.getTime() + 3600000).toISOString().slice(0, 16) : '',
            event_type: 'family',
            location: '',
            reminder_minutes: 30,
        },
    });

    const onSubmit = async (data: CalendarEventFormData) => {
        setLoading(true);
        try {
            // ✅ Calendar endpoints are now implemented in backend
            await api.post(endpoints.calendar.create, data);

            setOpen(false);
            form.reset();
            onEventCreated?.();
            // router.refresh(); // Uncomment if using Next.js router
        } catch (error: unknown) {
            console.error('Failed to create event:', error);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            alert((error as any).response?.data?.detail || 'Failed to create event');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    New Event
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Create Calendar Event</DialogTitle>
                    <DialogDescription>
                        Add a new event to your family calendar
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Event Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Family Dinner" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="event_type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Event Type</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="family">Family Event</SelectItem>
                                            <SelectItem value="personal">Personal Event</SelectItem>
                                            <SelectItem value="task">Task Deadline</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="start_time"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Start Time</FormLabel>
                                        <FormControl>
                                            <Input type="datetime-local" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="end_time"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>End Time</FormLabel>
                                        <FormControl>
                                            <Input type="datetime-local" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Location (Optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Home, Restaurant, etc." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description (Optional)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Event details..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="reminder_minutes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Reminder</FormLabel>
                                    <Select
                                        onValueChange={(val) => field.onChange(parseInt(val))}
                                        defaultValue={field.value?.toString()}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="0">No reminder</SelectItem>
                                            <SelectItem value="15">15 minutes before</SelectItem>
                                            <SelectItem value="30">30 minutes before</SelectItem>
                                            <SelectItem value="60">1 hour before</SelectItem>
                                            <SelectItem value="1440">1 day before</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        Get notified before the event starts
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                                Create Event
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
