'use client';

import { useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCorners } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Circle, CheckCircle2, Clock, Coins, Calendar, Tag } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { api, endpoints } from '@/lib/api';

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
}

interface KanbanBoardProps {
    tasks: Task[];
    onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
    onTaskComplete: (taskId: string) => void;
}

const PRIORITY_COLORS = {
    low: 'bg-blue-100 text-blue-800 border-blue-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    high: 'bg-red-100 text-red-800 border-red-200',
};

const STATUS_COLUMNS = {
    pending: { title: 'To Do', icon: Circle },
    in_progress: { title: 'In Progress', icon: Clock },
    completed: { title: 'Completed', icon: CheckCircle2 },
};

function SortableTaskCard({ task, onComplete }: { task: Task; onComplete: (id: string) => void }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task.task_id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style}>
            <Card className="mb-3 cursor-move hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing mt-1">
                            <GripVertical className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm mb-2 line-clamp-2">{task.title}</h4>

                            {task.description && (
                                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                                    {task.description}
                                </p>
                            )}

                            <div className="flex flex-wrap gap-2 mb-2">
                                <Badge variant="outline" className={PRIORITY_COLORS[task.priority]}>
                                    {task.priority}
                                </Badge>

                                {task.categories?.map((cat) => (
                                    <Badge key={cat} variant="secondary" className="text-xs">
                                        <Tag className="h-3 w-3 mr-1" />
                                        {cat}
                                    </Badge>
                                ))}
                            </div>

                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                {task.reward_amount && (
                                    <div className="flex items-center gap-1 text-primary font-medium">
                                        <Coins className="h-3 w-3" />
                                        <span>{task.reward_amount} SBD</span>
                                    </div>
                                )}

                                {task.due_date && (
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        <span>{formatDistanceToNow(new Date(task.due_date), { addSuffix: true })}</span>
                                    </div>
                                )}

                                {task.assigned_to_name && (
                                    <span>@{task.assigned_to_name}</span>
                                )}
                            </div>

                            {task.status !== 'completed' && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="mt-3 w-full"
                                    onClick={() => onComplete(task.task_id)}
                                >
                                    Mark Complete
                                </Button>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export function KanbanBoard({ tasks, onTaskUpdate, onTaskComplete }: KanbanBoardProps) {
    const [activeId, setActiveId] = useState<string | null>(null);

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over) {
            setActiveId(null);
            return;
        }

        const taskId = active.id as string;
        const newStatus = over.id as Task['status'];

        // Update task status
        if (newStatus !== tasks.find(t => t.task_id === taskId)?.status) {
            try {
                await api.put(endpoints.tasks.update(taskId), { status: newStatus });
                onTaskUpdate(taskId, { status: newStatus });
            } catch (error) {
                console.error('Failed to update task status:', error);
            }
        }

        setActiveId(null);
    };

    const getTasksByStatus = (status: Task['status']) => {
        return tasks.filter(task => task.status === status);
    };

    const activeTask = activeId ? tasks.find(t => t.task_id === activeId) : null;

    return (
        <DndContext
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(Object.entries(STATUS_COLUMNS) as [Task['status'], typeof STATUS_COLUMNS[keyof typeof STATUS_COLUMNS]][]).map(([status, { title, icon: Icon }]) => {
                    const columnTasks = getTasksByStatus(status);

                    return (
                        <SortableContext
                            key={status}
                            id={status}
                            items={columnTasks.map(t => t.task_id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <Card className="h-fit min-h-[500px]">
                                <CardHeader className="pb-3">
                                    <CardTitle className="flex items-center gap-2 text-base">
                                        <Icon className="h-5 w-5" />
                                        {title}
                                        <Badge variant="secondary" className="ml-auto">
                                            {columnTasks.length}
                                        </Badge>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div
                                        className="min-h-[400px] p-2 rounded-lg bg-muted/20"
                                        id={status}
                                    >
                                        {columnTasks.length === 0 ? (
                                            <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
                                                No tasks
                                            </div>
                                        ) : (
                                            columnTasks.map(task => (
                                                <SortableTaskCard
                                                    key={task.task_id}
                                                    task={task}
                                                    onComplete={onTaskComplete}
                                                />
                                            ))
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </SortableContext>
                    );
                })}
            </div>

            <DragOverlay>
                {activeTask && (
                    <Card className="cursor-grabbing shadow-lg">
                        <CardContent className="p-4">
                            <h4 className="font-semibold text-sm">{activeTask.title}</h4>
                        </CardContent>
                    </Card>
                )}
            </DragOverlay>
        </DndContext>
    );
}
