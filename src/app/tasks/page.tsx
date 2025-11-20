'use client';

import { useState, useEffect } from 'react';
import { api, endpoints } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { CreateTaskDialog } from '@/components/family/CreateTaskDialog';
import { KanbanBoard } from '@/components/family/KanbanBoard';
import { CheckCircle2, Circle, Filter, LayoutGrid, Tag, Coins, Calendar, ArrowRight, ListTodo } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Task {
    task_id: string;
    title: string;
    description?: string;
    assigned_to?: string;
    assigned_to_name?: string;
    reward_amount?: number;
    status: 'pending' | 'in_progress' | 'completed';
    priority: 'low' | 'medium' | 'high';
    categories?: string[];
    due_date?: string;
    created_at: string;
    parent_task_id?: string;
    depends_on?: string[];
    subtasks?: Task[];
}

const PRIORITY_COLORS = {
    low: 'bg-blue-100 text-blue-800 border-blue-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    high: 'bg-red-100 text-red-800 border-red-200',
};

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState<'list' | 'kanban'>('list');
    const [priorityFilter, setPriorityFilter] = useState<string>('all');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                // Get family ID from user's families
                const familiesResponse = await api.get(endpoints.family.myFamilies);
                if (familiesResponse.data.length > 0) {
                    const firstFamily = familiesResponse.data[0];

                    // Fetch tasks
                    const tasksResponse = await api.get(
                        `${endpoints.tasks.list}?family_id=${firstFamily.family_id}`
                    );

                    setTasks(tasksResponse.data);
                }
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
        } catch (error: unknown) {
            console.error('Failed to complete task:', error);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            alert((error as any).response?.data?.detail || 'Failed to complete task');
        }
    };

    const handleTaskUpdate = (taskId: string, updates: Partial<Task>) => {
        setTasks(tasks.map(t =>
            t.task_id === taskId ? { ...t, ...updates } : t
        ));
    };

    // Get all unique categories
    const allCategories = Array.from(
        new Set(tasks.flatMap(t => t.categories || []))
    );

    // Filter tasks
    const filteredTasks = tasks.filter(task => {
        if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;
        if (categoryFilter !== 'all' && !task.categories?.includes(categoryFilter)) return false;
        return true;
    });

    const pendingTasks = filteredTasks.filter(t => t.status === 'pending');
    const inProgressTasks = filteredTasks.filter(t => t.status === 'in_progress');
    const completedTasks = filteredTasks.filter(t => t.status === 'completed');

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

    const TaskCard = ({ task }: { task: Task }) => {
        const dependentTasks = task.depends_on?.map(depId =>
            tasks.find(t => t.task_id === depId)
        ).filter(Boolean) || [];

        return (
            <Card key={task.task_id}>
                <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                        <div className="flex gap-4 flex-1">
                            {task.status === 'completed' ? (
                                <CheckCircle2 className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                            ) : (
                                <Circle className="h-6 w-6 text-muted-foreground mt-1 flex-shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                                <h3 className={`font-semibold text-lg ${task.status === 'completed' ? 'line-through opacity-60' : ''}`}>
                                    {task.title}
                                </h3>
                                {task.description && (
                                    <p className="text-muted-foreground mt-1">{task.description}</p>
                                )}

                                <div className="flex flex-wrap items-center gap-2 mt-3">
                                    <Badge variant="outline" className={PRIORITY_COLORS[task.priority]}>
                                        {task.priority} priority
                                    </Badge>

                                    {task.categories?.map((cat) => (
                                        <Badge key={cat} variant="secondary">
                                            <Tag className="h-3 w-3 mr-1" />
                                            {cat}
                                        </Badge>
                                    ))}

                                    {task.status === 'in_progress' && (
                                        <Badge variant="default">In Progress</Badge>
                                    )}
                                </div>

                                <div className="flex flex-wrap items-center gap-4 mt-3">
                                    {task.reward_amount && (
                                        <div className="flex items-center gap-1 text-primary font-medium">
                                            <Coins className="h-4 w-4" />
                                            <span>{task.reward_amount} SBD</span>
                                        </div>
                                    )}
                                    {task.due_date && (
                                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                            <Calendar className="h-4 w-4" />
                                            <span>Due {formatDistanceToNow(new Date(task.due_date), { addSuffix: true })}</span>
                                        </div>
                                    )}
                                    {task.assigned_to_name && (
                                        <span className="text-sm text-muted-foreground">
                                            Assigned to @{task.assigned_to_name}
                                        </span>
                                    )}
                                </div>

                                {/* Subtasks */}
                                {task.subtasks && task.subtasks.length > 0 && (
                                    <div className="mt-3 pl-4 border-l-2 border-muted">
                                        <div className="text-sm font-medium mb-2">
                                            Subtasks ({task.subtasks.filter(st => st.status === 'completed').length}/{task.subtasks.length})
                                        </div>
                                        {task.subtasks.map(subtask => (
                                            <div key={subtask.task_id} className="flex items-center gap-2 text-sm mb-1">
                                                {subtask.status === 'completed' ? (
                                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                ) : (
                                                    <Circle className="h-4 w-4 text-muted-foreground" />
                                                )}
                                                <span className={subtask.status === 'completed' ? 'line-through opacity-60' : ''}>
                                                    {subtask.title}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Dependencies */}
                                {dependentTasks.length > 0 && (
                                    <div className="mt-3 flex items-start gap-2 text-sm text-muted-foreground">
                                        <ArrowRight className="h-4 w-4 mt-0.5" />
                                        <div>
                                            <span className="font-medium">Depends on:</span>
                                            {dependentTasks.map((dep, idx) => (
                                                <span key={dep?.task_id}>
                                                    {idx > 0 && ', '}
                                                    <span className={dep?.status === 'completed' ? 'line-through' : ''}>
                                                        {dep?.title}
                                                    </span>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        {task.status !== 'completed' && (
                            <Button onClick={() => handleCompleteTask(task.task_id)}>
                                Mark Complete
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        );
    };

    return (
        <div className="min-h-screen bg-background py-10">
            <div className="container">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Family Tasks</h1>
                        <p className="text-muted-foreground mt-1">
                            {pendingTasks.length} pending • {inProgressTasks.length} in progress • {completedTasks.length} completed
                        </p>
                    </div>
                    <CreateTaskDialog onTaskCreated={() => window.location.reload()} />
                </div>

                {/* View Toggle and Filters */}
                <div className="flex flex-wrap items-center gap-4 mb-6">
                    <Tabs value={view} onValueChange={(v) => setView(v as 'list' | 'kanban')}>
                        <TabsList>
                            <TabsTrigger value="list" className="gap-2">
                                <ListTodo className="h-4 w-4" />
                                List View
                            </TabsTrigger>
                            <TabsTrigger value="kanban" className="gap-2">
                                <LayoutGrid className="h-4 w-4" />
                                Kanban Board
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>

                    <div className="flex items-center gap-2 ml-auto">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Priorities</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="low">Low</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {allCategories.map(cat => (
                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Content */}
                {view === 'kanban' ? (
                    <KanbanBoard
                        tasks={filteredTasks}
                        onTaskUpdate={handleTaskUpdate}
                        onTaskComplete={handleCompleteTask}
                    />
                ) : (
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
                                    {pendingTasks.map(task => <TaskCard key={task.task_id} task={task} />)}
                                </div>
                            )}
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold mb-4">In Progress</h2>
                            {inProgressTasks.length === 0 ? (
                                <Card>
                                    <CardContent className="py-10 text-center text-muted-foreground">
                                        No tasks in progress
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="space-y-4">
                                    {inProgressTasks.map(task => <TaskCard key={task.task_id} task={task} />)}
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
                                    {completedTasks.map(task => <TaskCard key={task.task_id} task={task} />)}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
