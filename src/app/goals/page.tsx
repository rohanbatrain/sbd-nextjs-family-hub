'use client';

import { useState, useEffect } from 'react';
import { api, endpoints } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Target, TrendingUp, Calendar, Users } from 'lucide-react';

interface Goal {
    goal_id: string;
    title: string;
    description?: string;
    target_date?: string;
    goal_type: 'individual' | 'family';
    assigned_to?: string;
    assigned_to_name?: string;
    milestones: string[];
    completed_milestones: string[];
    progress: number;
    created_by_name?: string;
}

export default function GoalsPage() {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [loading, setLoading] = useState(true);
    // familyId is used for fetching but not rendered directly, keeping it in state for potential future use or removing if strictly unused.
    // The linter complains it's assigned but never used.
    // Let's remove the state if it's truly not used elsewhere.

    useEffect(() => {
        const fetchGoals = async () => {
            try {
                const familiesResponse = await api.get(endpoints.family.myFamilies);
                if (familiesResponse.data.length > 0) {
                    const firstFamily = familiesResponse.data[0];
                    // setFamilyId(firstFamily.family_id); // Removed unused state setter

                    const goalsResponse = await api.get(endpoints.goals.list(firstFamily.family_id));
                    setGoals(goalsResponse.data);
                }
            } catch (error) {
                console.error('Failed to fetch goals:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchGoals();
    }, []);

    if (loading) {
        return (
            <div className="container py-10 space-y-6">
                <Skeleton className="h-12 w-[250px]" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-[200px] w-full" />
                    ))}
                </div>
            </div>
        );
    }

    const familyGoals = goals.filter(g => g.goal_type === 'family');
    const individualGoals = goals.filter(g => g.goal_type === 'individual');

    return (
        <div className="min-h-screen bg-background py-10">
            <div className="container">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Family Goals</h1>
                        <p className="text-muted-foreground mt-1">
                            {familyGoals.length} family goals • {individualGoals.length} individual goals
                        </p>
                    </div>
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        New Goal
                    </Button>
                </div>

                <div className="space-y-8">
                    <div>
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Family Goals
                        </h2>
                        {familyGoals.length === 0 ? (
                            <Card>
                                <CardContent className="py-10 text-center text-muted-foreground">
                                    No family goals yet. Create one to get started!
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {familyGoals.map(goal => (
                                    <Card key={goal.goal_id} className="hover:shadow-lg transition-shadow">
                                        <CardHeader>
                                            <div className="flex items-start justify-between">
                                                <CardTitle className="flex items-center gap-2">
                                                    <Target className="h-5 w-5 text-primary" />
                                                    {goal.title}
                                                </CardTitle>
                                                <Badge variant={goal.progress === 100 ? 'default' : 'secondary'}>
                                                    {goal.progress}%
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            {goal.description && (
                                                <p className="text-sm text-muted-foreground">{goal.description}</p>
                                            )}

                                            <div>
                                                <div className="flex items-center justify-between text-sm mb-2">
                                                    <span className="font-medium">Progress</span>
                                                    <span className="text-muted-foreground">
                                                        {goal.completed_milestones.length}/{goal.milestones.length} milestones
                                                    </span>
                                                </div>
                                                <Progress value={goal.progress} className="h-2" />
                                            </div>

                                            {goal.target_date && (
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Calendar className="h-4 w-4" />
                                                    Target: {new Date(goal.target_date).toLocaleDateString()}
                                                </div>
                                            )}

                                            {goal.milestones.length > 0 && (
                                                <div className="space-y-2">
                                                    <p className="text-sm font-medium">Milestones:</p>
                                                    <div className="space-y-1">
                                                        {goal.milestones.slice(0, 3).map((milestone, idx) => (
                                                            <div key={idx} className="flex items-center gap-2 text-sm">
                                                                {goal.completed_milestones.includes(milestone) ? (
                                                                    <span className="text-green-500">✓</span>
                                                                ) : (
                                                                    <span className="text-muted-foreground">○</span>
                                                                )}
                                                                <span className={goal.completed_milestones.includes(milestone) ? 'line-through text-muted-foreground' : ''}>
                                                                    {milestone}
                                                                </span>
                                                            </div>
                                                        ))}
                                                        {goal.milestones.length > 3 && (
                                                            <p className="text-xs text-muted-foreground">
                                                                +{goal.milestones.length - 3} more
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            Individual Goals
                        </h2>
                        {individualGoals.length === 0 ? (
                            <Card>
                                <CardContent className="py-10 text-center text-muted-foreground">
                                    No individual goals yet
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {individualGoals.map(goal => (
                                    <Card key={goal.goal_id} className="hover:shadow-lg transition-shadow">
                                        <CardHeader>
                                            <div className="flex items-start justify-between">
                                                <CardTitle className="text-lg">{goal.title}</CardTitle>
                                                <Badge variant={goal.progress === 100 ? 'default' : 'outline'}>
                                                    {goal.progress}%
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            {goal.assigned_to_name && (
                                                <p className="text-sm text-muted-foreground">
                                                    Assigned to: {goal.assigned_to_name}
                                                </p>
                                            )}
                                            <Progress value={goal.progress} className="h-2" />
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
