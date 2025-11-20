'use client';

import { useState, useEffect } from 'react';
import { api, endpoints } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, ShoppingCart } from 'lucide-react';



interface ShoppingListItem {
    item_id: string;
    name: string;
    quantity?: string;
    category?: string;
    checked: boolean;
}

interface ShoppingList {
    list_id: string;
    name: string;
    items: ShoppingListItem[];
    created_by_name?: string;
}

export default function ShoppingPage() {
    const [lists, setLists] = useState<ShoppingList[]>([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchLists = async () => {
            try {
                const familiesResponse = await api.get(endpoints.family.myFamilies);
                if (familiesResponse.data.length > 0) {
                    const firstFamily = familiesResponse.data[0];


                    const listsResponse = await api.get(endpoints.shopping.lists(firstFamily.family_id));
                    setLists(listsResponse.data);
                }
            } catch (error) {
                console.error('Failed to fetch shopping lists:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLists();
    }, []);

    if (loading) {
        return (
            <div className="container py-10 space-y-6">
                <Skeleton className="h-12 w-[250px]" />
                <Skeleton className="h-[400px] w-full" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background py-10">
            <div className="container">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Shopping Lists</h1>
                        <p className="text-muted-foreground mt-1">
                            {lists.length} active {lists.length === 1 ? 'list' : 'lists'}
                        </p>
                    </div>
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        New List
                    </Button>
                </div>

                {lists.length === 0 ? (
                    <Card>
                        <CardContent className="py-20 text-center">
                            <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No Shopping Lists</h3>
                            <p className="text-muted-foreground mb-4">
                                Create your first shopping list to get started
                            </p>
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                Create List
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {lists.map(list => {
                            const checkedCount = list.items.filter(i => i.checked).length;
                            const totalCount = list.items.length;

                            return (
                                <Card key={list.list_id}>
                                    <CardHeader>
                                        <CardTitle className="flex items-center justify-between">
                                            <span>{list.name}</span>
                                            <span className="text-sm font-normal text-muted-foreground">
                                                {checkedCount}/{totalCount}
                                            </span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {list.items.length === 0 ? (
                                            <p className="text-sm text-muted-foreground py-4 text-center">
                                                No items in this list
                                            </p>
                                        ) : (
                                            <div className="space-y-3">
                                                {list.items.map(item => (
                                                    <div key={item.item_id} className="flex items-center gap-3 p-2 rounded hover:bg-accent">
                                                        <Checkbox
                                                            checked={item.checked}
                                                            className="h-5 w-5"
                                                        />
                                                        <div className="flex-1">
                                                            <p className={`font-medium ${item.checked ? 'line-through text-muted-foreground' : ''}`}>
                                                                {item.name}
                                                            </p>
                                                            {item.quantity && (
                                                                <p className="text-sm text-muted-foreground">
                                                                    {item.quantity}
                                                                </p>
                                                            )}
                                                        </div>
                                                        {item.category && (
                                                            <span className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
                                                                {item.category}
                                                            </span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        <Button variant="outline" className="w-full mt-4 gap-2">
                                            <Plus className="h-4 w-4" />
                                            Add Item
                                        </Button>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
