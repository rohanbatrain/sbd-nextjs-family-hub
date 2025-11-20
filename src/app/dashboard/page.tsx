'use client';

import { useState, useEffect } from 'react';
import { Family, FamilyMember, TokenAccount, TokenTransaction } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Coins, Calendar, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function DashboardPage() {
    const [family, setFamily] = useState<Family | null>(null);
    const [members, setMembers] = useState<FamilyMember[]>([]);
    const [tokenAccount, setTokenAccount] = useState<TokenAccount | null>(null);
    const [recentTransactions, setRecentTransactions] = useState<TokenTransaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await new Promise(resolve => setTimeout(resolve, 1000));

                setFamily({
                    family_id: 'fam_1',
                    name: 'The Smiths',
                    description: 'Our happy family',
                    created_at: '2024-01-01T00:00:00Z',
                    member_count: 4
                });

                setMembers([
                    {
                        member_id: 'mem_1',
                        user_id: 'user_1',
                        family_id: 'fam_1',
                        role: 'admin',
                        nickname: 'Dad',
                        joined_at: '2024-01-01T00:00:00Z'
                    },
                    {
                        member_id: 'mem_2',
                        user_id: 'user_2',
                        family_id: 'fam_1',
                        role: 'admin',
                        nickname: 'Mom',
                        joined_at: '2024-01-01T00:00:00Z'
                    },
                    {
                        member_id: 'mem_3',
                        user_id: 'user_3',
                        family_id: 'fam_1',
                        role: 'member',
                        nickname: 'Emma',
                        joined_at: '2024-01-02T00:00:00Z'
                    },
                    {
                        member_id: 'mem_4',
                        user_id: 'user_4',
                        family_id: 'fam_1',
                        role: 'member',
                        nickname: 'Jack',
                        joined_at: '2024-01-02T00:00:00Z'
                    }
                ]);

                setTokenAccount({
                    account_id: 'acc_1',
                    family_id: 'fam_1',
                    balance: 5000,
                    currency: 'SBD'
                });

                setRecentTransactions([
                    {
                        transaction_id: 'txn_1',
                        from_user_id: 'user_1',
                        to_user_id: 'user_3',
                        amount: 50,
                        description: 'Weekly allowance',
                        created_at: '2024-03-15T10:00:00Z'
                    },
                    {
                        transaction_id: 'txn_2',
                        from_user_id: 'user_2',
                        to_user_id: 'user_4',
                        amount: 25,
                        description: 'Chores completed',
                        created_at: '2024-03-14T15:30:00Z'
                    }
                ]);
            } catch (error) {
                console.error('Failed to fetch data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="container py-10 space-y-8">
                <Skeleton className="h-32 w-full" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-[200px] w-full" />
                    ))}
                </div>
            </div>
        );
    }

    if (!family) return <div>Family not found</div>;

    return (
        <div className="min-h-screen bg-background">
            <div className="container py-10 space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">{family.name}</h1>
                        <p className="text-muted-foreground mt-1">{family.description}</p>
                    </div>
                    <Button>Invite Member</Button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Family Members</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{family.member_count}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {members.filter(m => m.role === 'admin').length} admins
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Token Balance</CardTitle>
                            <Coins className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{tokenAccount?.balance.toLocaleString()} SBD</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                <span className="text-green-600 flex items-center gap-1">
                                    <TrendingUp className="h-3 w-3" /> +12% this month
                                </span>
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">3</div>
                            <p className="text-xs text-muted-foreground mt-1">Next: Family dinner tonight</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Family Members */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Family Members</CardTitle>
                            <CardDescription>Manage your family members and roles</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {members.map(member => (
                                <div key={member.member_id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarFallback>{member.nickname?.charAt(0) || 'U'}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">{member.nickname}</p>
                                            <p className="text-xs text-muted-foreground">
                                                Joined {formatDistanceToNow(new Date(member.joined_at), { addSuffix: true })}
                                            </p>
                                        </div>
                                    </div>
                                    <Badge variant={member.role === 'admin' ? 'default' : 'secondary'}>
                                        {member.role}
                                    </Badge>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Recent Transactions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Transactions</CardTitle>
                            <CardDescription>Latest token transfers in your family</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {recentTransactions.map(txn => (
                                <div key={txn.transaction_id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${txn.from_user_id === 'user_1' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                                            }`}>
                                            {txn.from_user_id === 'user_1' ? (
                                                <ArrowUpRight className="h-5 w-5" />
                                            ) : (
                                                <ArrowDownRight className="h-5 w-5" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium">{txn.description}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {formatDistanceToNow(new Date(txn.created_at), { addSuffix: true })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className={`font-semibold ${txn.from_user_id === 'user_1' ? 'text-red-600' : 'text-green-600'
                                        }`}>
                                        {txn.from_user_id === 'user_1' ? '-' : '+'}{txn.amount} SBD
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
