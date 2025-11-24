'use client';

import { useState, useEffect } from 'react';
import { api, endpoints } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Coins, Gift, TrendingUp, Plus, ShoppingBag, DollarSign } from 'lucide-react';

interface TokenRule {
    rule_id: string;
    rule_name: string;
    rule_type: string;
    token_amount: number;
    active: boolean;
}

interface Reward {
    reward_id: string;
    reward_name: string;
    description?: string;
    token_cost: number;
    category?: string;
    quantity_available?: number;
}

interface Transaction {
    transaction_id: string;
    username?: string;
    transaction_type: string;
    amount: number;
    description?: string;
    created_at: string;
}

export default function TokensPage() {
    const [rules, setRules] = useState<TokenRule[]>([]);
    const [rewards, setRewards] = useState<Reward[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    // const [familyId, setFamilyId] = useState(''); // Removed unused state

    useEffect(() => {
        const fetchTokenData = async () => {
            try {
                const familiesResponse = await api.get(endpoints.family.myFamilies);
                if (familiesResponse.data.length > 0) {
                    const firstFamily = familiesResponse.data[0];
                    // setFamilyId(firstFamily.family_id);

                    const [rulesRes, rewardsRes, transactionsRes] = await Promise.all([
                        api.get(endpoints.tokens.rules(firstFamily.family_id)),
                        api.get(endpoints.tokens.rewards(firstFamily.family_id)),
                        api.get(endpoints.tokens.transactions(firstFamily.family_id)),
                    ]);

                    setRules(rulesRes.data);
                    setRewards(rewardsRes.data);
                    setTransactions(transactionsRes.data);
                }
            } catch (error) {
                console.error('Failed to fetch token data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTokenData();
    }, []);

    if (loading) {
        return (
            <div className="container py-10 space-y-6">
                <Skeleton className="h-12 w-[300px]" />
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-[120px] w-full" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background py-10">
            <div className="container">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Token Management</h1>
                        <p className="text-muted-foreground mt-1">
                            Manage earning rules, rewards, and allowances
                        </p>
                    </div>
                </div>

                <Tabs defaultValue="rewards" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
                        <TabsTrigger value="rewards">Rewards</TabsTrigger>
                        <TabsTrigger value="rules">Earning Rules</TabsTrigger>
                        <TabsTrigger value="history">History</TabsTrigger>
                    </TabsList>

                    <TabsContent value="rewards" className="space-y-4">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <Gift className="h-5 w-5" />
                                Reward Marketplace
                            </h2>
                            <Button className="gap-2">
                                <Plus className="h-4 w-4" />
                                Add Reward
                            </Button>
                        </div>

                        {rewards.length === 0 ? (
                            <Card>
                                <CardContent className="py-10 text-center text-muted-foreground">
                                    No rewards available yet
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {rewards.map(reward => (
                                    <Card key={reward.reward_id} className="hover:shadow-lg transition-shadow">
                                        <CardHeader>
                                            <CardTitle className="text-lg flex items-start justify-between">
                                                <span className="flex-1">{reward.reward_name}</span>
                                                <Badge variant="secondary" className="ml-2 flex items-center gap-1">
                                                    <Coins className="h-3 w-3" />
                                                    {reward.token_cost}
                                                </Badge>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            {reward.description && (
                                                <p className="text-sm text-muted-foreground">{reward.description}</p>
                                            )}
                                            {reward.category && (
                                                <Badge variant="outline">{reward.category}</Badge>
                                            )}
                                            {reward.quantity_available !== undefined && (
                                                <p className="text-xs text-muted-foreground">
                                                    {reward.quantity_available} available
                                                </p>
                                            )}
                                            <Button className="w-full" variant="outline">
                                                <ShoppingBag className="h-4 w-4 mr-2" />
                                                Purchase
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="rules" className="space-y-4">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <TrendingUp className="h-5 w-5" />
                                Earning Rules
                            </h2>
                            <Button className="gap-2">
                                <Plus className="h-4 w-4" />
                                Add Rule
                            </Button>
                        </div>

                        {rules.length === 0 ? (
                            <Card>
                                <CardContent className="py-10 text-center text-muted-foreground">
                                    No earning rules configured
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-3">
                                {rules.map(rule => (
                                    <Card key={rule.rule_id}>
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <h3 className="font-semibold">{rule.rule_name}</h3>
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        Type: {rule.rule_type.replace('_', ' ')}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <Badge variant="default" className="flex items-center gap-1">
                                                        <Coins className="h-3 w-3" />
                                                        +{rule.token_amount}
                                                    </Badge>
                                                    <Badge variant={rule.active ? 'default' : 'secondary'}>
                                                        {rule.active ? 'Active' : 'Inactive'}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="history" className="space-y-4">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <DollarSign className="h-5 w-5" />
                            Transaction History
                        </h2>

                        {transactions.length === 0 ? (
                            <Card>
                                <CardContent className="py-10 text-center text-muted-foreground">
                                    No transactions yet
                                </CardContent>
                            </Card>
                        ) : (
                            <Card>
                                <CardContent className="p-0">
                                    <div className="divide-y">
                                        {transactions.map(tx => (
                                            <div key={tx.transaction_id} className="p-4 flex items-center justify-between">
                                                <div className="flex-1">
                                                    <p className="font-medium">{tx.description || tx.transaction_type}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {tx.username && `${tx.username} • `}
                                                        {new Date(tx.created_at).toLocaleString()}
                                                    </p>
                                                </div>
                                                <Badge
                                                    variant={tx.transaction_type === 'earned' || tx.transaction_type === 'allowance' ? 'default' : 'secondary'}
                                                    className="flex items-center gap-1"
                                                >
                                                    {tx.transaction_type === 'earned' || tx.transaction_type === 'allowance' ? '+' : '-'}
                                                    {tx.amount} <Coins className="h-3 w-3 ml-1" />
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
