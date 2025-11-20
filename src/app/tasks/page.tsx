'use client';

import { useState, useEffect } from 'react';
import { api, endpoints } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CreateTaskDialog } from '@/components/family/CreateTaskDialog';
import { CheckCircle2, Circle, Coins, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Task {
    task_id: string;
    title: string;
    description?: string;
    assigned_to?: string;
    reward_amount: number;
    status: 'pending' | 'completed';
    due_date?: string;
    created_at: string;
}

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                // Mock data - replace with actual API call
                await new Promise(resolve => setTimeout(resolve, 1000));

                setTasks([
                    {
                        task_id: 'task_1',
                        title: 'Clean the kitchen',
                        description: 'Wash dishes and wipe counters',
                        reward_amount: 50,
                        status: 'pending',
                        due_date: '2024-03-20',
                        created_at: '2024-03-15T10:00:00Z'
                    },
                    {
                        task_id: 'task_2',
                        title: 'Mow the lawn',
                        reward_amount: 100,
                        status: 'pending',
                        created_at: '2024-03-14T10:00:00Z'
                    },
                    {
                        task_id: 'task_3',
                        title: 'Homework completion',
                        reward_amount: 75,
                        status: 'completed',
                        created_at: '2024-03-10T10:00:00Z'
                    }
                ]);
            } catch (error) {
                console.error('Failed to fetch tasks:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);

    const handleCompleteTask = async (taskId: string) => {
        try {
            await api.post(endpoints.tasks.complete(taskId));
            setTasks(tasks.map(t =>
                t.task_id === taskId ? { ...t, status: 'completed' as const } : t
            ));
        } catch (error: any) {
            console.error('Failed to complete task:', error);
            alert(error.response?.data?.detail || 'Failed to complete task');
        }
    };

    if (loading) {
        return (
            <div className="container py-10 space-y-6">
                <Skeleton className="h-12 w-[200px]" />
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-[120px] w-full" />
                    ))}
                </div>
            </div>
        );
    }

    const pendingTasks = tasks.filter(t => t.status === 'pending');
    const completedTasks = tasks.filter(t => t.status === 'completed');

    return (
        <div className="min-h-screen bg-background py-10">
            <div className="container">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Family Tasks</h1>
                        <p className="text-muted-foreground mt-1">
                            {pendingTasks.length} pending tasks
                        </p>
                    </div>
                    <CreateTaskDialog onTaskCreated={() => window.location.reload()} />
                </div>

                <div className="space-y-8">
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Pending Tasks</h2>
                        {pendingTasks.length === 0 ? (
                            <Card>
                                <CardContent className="py-10 text-center text-muted-foreground">
                                    No pending tasks
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-4">
                                {pendingTasks.map(task => (
                                    <Card key={task.task_id}>
                                        <CardContent className="p-6">
                                            <div className="flex items-start justify-between">
                                                <div className="flex gap-4 flex-1">
                                                    <Circle className="h-6 w-6 text-muted-foreground mt-1" />
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold text-lg">{task.title}</h3>
                                                        {task.description && (
                                                            <p className="text-muted-foreground mt-1">{task.description}</p>
                                                        )}
                                                        <div className="flex items-center gap-4 mt-3">
                                                            <div className="flex items-center gap-1 text-primary font-medium">
                                                                <Coins className="h-4 w-4" />
                                                                <span>{task.reward_amount} SBD</span>
                                                            </div>
                                                            {task.due_date && (
                                                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                                    <Calendar className="h-4 w-4" />
                                                                    <span>Due {formatDistanceToNow(new Date(task.due_date), { addSuffix: true })}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <Button onClick={() => handleCompleteTask(task.task_id)}>
                                                    Mark Complete
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mb-4">Completed Tasks</h2>
                        {completedTasks.length === 0 ? (
                            <Card>
                                <CardContent className="py-10 text-center text-muted-foreground">
                                    No completed tasks yet
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-4">
                                {completedTasks.map(task => (
                                    <Card key={task.task_id} className="opacity-60">
                                        <CardContent className="p-6">
                                            <div className="flex items-start gap-4">
                                                <CheckCircle2 className="h-6 w-6 text-green-500 mt-1" />
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-lg line-through">{task.title}</h3>
                                                    <div className="flex items-center gap-1 text-primary font-medium mt-2">
                                                        <Coins className="h-4 w-4" />
                                                        <span>{task.reward_amount} SBD earned</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
