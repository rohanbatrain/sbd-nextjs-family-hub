export interface Family {
    family_id: string;
    name: string;
    description?: string;
    created_at: string;
    member_count: number;
}

export interface FamilyMember {
    member_id: string;
    user_id: string;
    family_id: string;
    role: 'admin' | 'member';
    nickname?: string;
    joined_at: string;
}

export interface TokenAccount {
    account_id: string;
    family_id: string;
    balance: number;
    currency: string;
}

export interface TokenTransaction {
    transaction_id: string;
    from_user_id: string;
    to_user_id: string;
    amount: number;
    description?: string;
    created_at: string;
}

export interface FamilyEvent {
    event_id: string;
    family_id: string;
    title: string;
    description?: string;
    start_time: string;
    end_time: string;
    location?: string;
    created_by: string;
}

export interface FamilyTask {
    task_id: string;
    family_id: string;
    title: string;
    description?: string;
    assigned_to?: string;
    status: 'pending' | 'in_progress' | 'completed';
    due_date?: string;
    created_at: string;
}
