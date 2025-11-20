'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import { ArrowRightLeft, Loader2 } from 'lucide-react';

const transferSchema = z.object({
    to_user_id: z.string().min(1, 'Recipient is required'),
    amount: z.number().min(1, 'Amount must be at least 1'),
    description: z.string().optional(),
});

type TransferFormData = z.infer<typeof transferSchema>;

interface TokenTransferDialogProps {
    familyMembers: Array<{ user_id: string; nickname?: string }>;
    onTransferComplete?: () => void;
}

export function TokenTransferDialog({ familyMembers, onTransferComplete }: TokenTransferDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    const form = useForm<TransferFormData>({
        resolver: zodResolver(transferSchema),
        defaultValues: {
            to_user_id: '',
            amount: 0,
            description: '',
        },
    });

    const onSubmit = async (data: TransferFormData) => {
        setLoading(true);
        try {
            // Note: Using SBD tokens endpoint since family.tokens was removed
            // This uses the global SBD token transfer system
            await api.post('/sbd-tokens/send', {
                to_user: data.to_user_id,
                amount: data.amount,
                note: data.description,
            });

            setOpen(false);
            form.reset();
            onTransferComplete?.();
            router.refresh();
        } catch (error: unknown) {
            console.error('Failed to transfer tokens:', error);
            toast({
                title: "Error",
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                description: (error as any).response?.data?.detail || 'Failed to transfer tokens',
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <ArrowRightLeft className="h-4 w-4" />
                    Transfer Tokens
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Transfer Tokens</DialogTitle>
                    <DialogDescription>
                        Send SBD tokens to a family member.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="to_user_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Recipient</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select family member" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {familyMembers.map(member => (
                                                <SelectItem key={member.user_id} value={member.user_id}>
                                                    {member.nickname || member.user_id}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Amount (SBD)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="100"
                                            {...field}
                                            onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Enter the amount of tokens to transfer
                                    </FormDescription>
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
                                            placeholder="Weekly allowance, reward for chores, etc."
                                            {...field}
                                        />
                                    </FormControl>
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
                                Transfer
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
