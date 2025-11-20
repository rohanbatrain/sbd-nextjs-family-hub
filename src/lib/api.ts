import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const endpoints = {
    auth: {
        login: '/auth/login',
        register: '/auth/register',
    },
    family: {
        // Fixed: correct backend paths
        create: '/family/create',
        myFamilies: '/family/my-families',
        invite: (familyId: string) => `/family/${familyId}/invite`,
        myInvitations: '/family/my-invitations',
        respondToInvitation: (invitationId: string) => `/family/invitation/${invitationId}/respond`,
        acceptInvitationByToken: (token: string) => `/family/invitation/${token}/accept`,
    },
    wallet: {
        // Fixed: wallet endpoints use /family/wallet prefix
        purchaseRequests: (familyId: string) => `/family/wallet/purchase-requests?family_id=${familyId}`,
        approvePurchase: (requestId: string) => `/family/wallet/purchase-requests/${requestId}/approve`,
        denyPurchase: (requestId: string) => `/family/wallet/purchase-requests/${requestId}/deny`,
    },
    // ✅ Calendar and Tasks REST API endpoints - BACKEND IMPLEMENTED
    // All endpoints are now available and fully functional
    calendar: {
        events: '/family/calendar/events',                              // ✅ GET calendar events
        create: '/family/calendar/events',                              // ✅ POST create event
        update: (eventId: string) => `/family/calendar/events/${eventId}`, // ✅ PUT update event
        delete: (eventId: string) => `/family/calendar/events/${eventId}`, // ✅ DELETE event
        export: (familyId: string) => `/family/${familyId}/calendar/export`, // ✅ GET iCal export
        checkConflicts: '/family/calendar/events/check-conflicts',      // ✅ POST check conflicts
    },
    tasks: {
        list: '/family/tasks',                                          // ✅ GET tasks
        create: '/family/tasks',                                        // ✅ POST create task
        update: (taskId: string) => `/family/tasks/${taskId}`,          // ✅ PUT update task
        complete: (taskId: string) => `/family/tasks/${taskId}/complete`, // ✅ POST complete task
        subtasks: (taskId: string) => `/family/tasks/${taskId}/subtasks`, // ✅ GET/POST subtasks
    },
    // ✅ Extended features - NEW ENDPOINTS
    photos: {
        upload: (familyId: string) => `/family/${familyId}/photos`,
        list: (familyId: string) => `/family/${familyId}/photos`,
        delete: (familyId: string, photoId: string) => `/family/${familyId}/photos/${photoId}`,
    },
    shopping: {
        lists: (familyId: string) => `/family/${familyId}/shopping-lists`,
        create: (familyId: string) => `/family/${familyId}/shopping-lists`,
        update: (familyId: string, listId: string) => `/family/${familyId}/shopping-lists/${listId}`,
    },
    meals: {
        plans: (familyId: string) => `/family/${familyId}/meal-plans`,
        create: (familyId: string) => `/family/${familyId}/meal-plans`,
    },
    chores: {
        rotations: (familyId: string) => `/family/${familyId}/chores`,
        create: (familyId: string) => `/family/${familyId}/chores`,
    },
    goals: {
        list: (familyId: string) => `/family/${familyId}/goals`,
        create: (familyId: string) => `/family/${familyId}/goals`,
        update: (familyId: string, goalId: string) => `/family/${familyId}/goals/${goalId}`,
    },
    tokens: {
        rules: (familyId: string) => `/family/${familyId}/token-rules`,
        createRule: (familyId: string) => `/family/${familyId}/token-rules`,
        rewards: (familyId: string) => `/family/${familyId}/rewards`,
        createReward: (familyId: string) => `/family/${familyId}/rewards`,
        purchaseReward: (familyId: string, rewardId: string) => `/family/${familyId}/rewards/${rewardId}/purchase`,
        transactions: (familyId: string) => `/family/${familyId}/token-transactions`,
        allowances: (familyId: string) => `/family/${familyId}/allowances`,
        createAllowance: (familyId: string) => `/family/${familyId}/allowances`,
    },
};
