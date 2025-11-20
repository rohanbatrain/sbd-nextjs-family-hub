'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Bell, Check, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
    notification_id: string;
    type: 'token_transfer' | 'task_completed' | 'event_created' | 'member_joined';
    title: string;
    message: string;
    read: boolean;
    created_at: string;
}

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                await new Promise(resolve => setTimeout(resolve, 1000));

                setNotifications([
                    {
                        notification_id: 'not_1',
                        type: 'token_transfer',
                        title: 'Tokens Received',
                        message: 'You received 100 SBD from Mom',
                        read: false,
                        created_at: '2024-03-15T10:00:00Z'
                    },
                    {
                        notification_id: 'not_2',
                        type: 'task_completed',
                        title: 'Task Completed',
                        message: 'Sarah completed "Clean the kitchen" and earned 50 SBD',
                        read: false,
                        created_at: '2024-03-14T10:00:00Z'
                    },
                    {
                        notification_id: 'not_3',
                        type: 'event_created',
                        title: 'New Event',
                        message: 'Family dinner scheduled for tomorrow at 7 PM',
                        read: true,
                        created_at: '2024-03-10T10:00:00Z'
                    }
                ]);
            } catch (error) {
                console.error('Failed to fetch notifications:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    const markAsRead = (notificationId: string) => {
        setNotifications(notifications.map(n =>
            n.notification_id === notificationId ? { ...n, read: true } : n
        ));
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const deleteNotification = (notificationId: string) => {
        setNotifications(notifications.filter(n => n.notification_id !== notificationId));
    };

    if (loading) {
        return (
            <div className="container py-10 space-y-6">
                <Skeleton className="h-12 w-[200px]" />
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-[100px] w-full" />
                    ))}
                </div>
            </div>
        );
    }

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="min-h-screen bg-background py-10">
            <div className="container max-w-4xl">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold mb-1">Notifications</h1>
                        <p className="text-muted-foreground">
                            {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                        </p>
                    </div>
                    {unreadCount > 0 && (
                        <Button variant="outline" onClick={markAllAsRead}>
                            Mark All as Read
                        </Button>
                    )}
                </div>

                {notifications.length === 0 ? (
                    <Card>
                        <CardContent className="py-20 text-center">
                            <Bell className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                            <h2 className="text-xl font-semibold mb-2">No notifications</h2>
                            <p className="text-muted-foreground">
                                You're all caught up!
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-3">
                        {notifications.map(notification => (
                            <Card
                                key={notification.notification_id}
                                className={notification.read ? 'opacity-60' : 'border-primary/50'}
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-start gap-4">
                                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${notification.read ? 'bg-muted' : 'bg-primary/10'
                                            }`}>
                                            <Bell className={`h-5 w-5 ${notification.read ? 'text-muted-foreground' : 'text-primary'}`} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-1">
                                                <div>
                                                    <h3 className="font-semibold">{notification.title}</h3>
                                                    {!notification.read && (
                                                        <Badge variant="default" className="ml-2">New</Badge>
                                                    )}
                                                </div>
                                                <span className="text-xs text-muted-foreground">
                                                    {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                                                </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">{notification.message}</p>
                                        </div>
                                        <div className="flex gap-1">
                                            {!notification.read && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => markAsRead(notification.notification_id)}
                                                >
                                                    <Check className="h-4 w-4" />
                                                </Button>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => deleteNotification(notification.notification_id)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
