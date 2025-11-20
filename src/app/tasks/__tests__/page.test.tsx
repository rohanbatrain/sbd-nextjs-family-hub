import { render, screen, waitFor, within } from '../../utils/test-utils';
import { mockApiResponse, mockApiError } from '../../utils/mock-api';
import TasksPage from '@/app/tasks/page';
import * as api from '@/lib/api';

// Mock the API
jest.mock('@/lib/api', () => ({
    api: {
        get: jest.fn(),
        post: jest.fn(),
    },
    endpoints: {
        family: { myFamilies: '/family/my-families' },
        tasks: {
            list: '/tasks',
            complete: (id: string) => `/tasks/${id}/complete`,
        },
    },
}));

const mockFamilies = [
    { family_id: 'family-1', name: 'Test Family' },
];

const mockTasks = [
    {
        task_id: 'task-1',
        title: 'Buy groceries',
        description: 'Get milk, bread, and eggs',
        status: 'pending',
        priority: 'high',
        reward_amount: 10,
        categories: ['shopping'],
        created_at: '2024-01-01T00:00:00Z',
    },
    {
        task_id: 'task-2',
        title: 'Clean garage',
        description: 'Organize tools and sweep floor',
        status: 'in_progress',
        priority: 'medium',
        reward_amount: 25,
        categories: ['chores'],
        assigned_to_name: 'John',
        due_date: '2024-12-31T00:00:00Z',
        created_at: '2024-01-02T00:00:00Z',
    },
    {
        task_id: 'task-3',
        title: 'Study for exam',
        description: null,
        status: 'completed',
        priority: 'high',
        reward_amount: 50,
        categories: ['education'],
        created_at: '2024-01-03T00:00:00Z',
    },
    {
        task_id: 'task-4',
        title: 'Water plants',
        status: 'pending',
        priority: 'low',
        reward_amount: 5,
        categories: ['chores'],
        created_at: '2024-01-04T00:00:00Z',
        subtasks: [
            {
                task_id: 'subtask-1',
                title: 'Water indoor plants',
                status: 'completed',
                priority: 'low',
                created_at: '2024-01-04T00:00:00Z',
            },
            {
                task_id: 'subtask-2',
                title: 'Water outdoor plants',
                status: 'pending',
                priority: 'low',
                created_at: '2024-01-04T00:00:00Z',
            },
        ],
    },
    {
        task_id: 'task-5',
        title: 'Finish homework',
        status: 'pending',
        priority: 'high',
        categories: ['education'],
        created_at: '2024-01-05T00:00:00Z',
        depends_on: ['task-3'],
    },
];

describe('TasksPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (api.api.get as jest.Mock).mockImplementation((url: string) => {
            if (url.includes('my-families')) {
                return mockApiResponse(mockFamilies);
            }
            if (url.includes('/tasks')) {
                return mockApiResponse(mockTasks);
            }
            return mockApiResponse([]);
        });
    });

    describe('Initial Load', () => {
        it('should render task page and load tasks', async () => {
            render(<TasksPage />);

            // Should show loading state initially
            expect(screen.getByRole('status')).toBeInTheDocument();

            // Wait for tasks to load
            await waitFor(() => {
                expect(screen.getByText('Family Tasks')).toBeInTheDocument();
            });

            // Should display task counts
            expect(screen.getByText(/2 pending/)).toBeInTheDocument();
            expect(screen.getByText(/1 in progress/)).toBeInTheDocument();
            expect(screen.getByText(/1 completed/)).toBeInTheDocument();

            // Should load tasks from correct family
            expect(api.api.get).toHaveBeenCalledWith(
                expect.stringContaining('family_id=family-1')
            );
        });

        it('should display all tasks grouped by status', async () => {
            render(<TasksPage />);

            await waitFor(() => {
                expect(screen.getByText('Buy groceries')).toBeInTheDocument();
            });

            // Verify pending tasks
            expect(screen.getByText('Buy groceries')).toBeInTheDocument();
            expect(screen.getByText('Water plants')).toBeInTheDocument();

            // Verify in-progress tasks
            expect(screen.getByText('Clean garage')).toBeInTheDocument();

            // Verify completed tasks
            expect(screen.getByText('Study for exam')).toBeInTheDocument();
        });

        it('should handle API error gracefully', async () => {
            (api.api.get as jest.Mock).mockImplementation(() =>
                mockApiError('Failed to fetch tasks', 500)
            );

            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

            render(<TasksPage />);

            await waitFor(() => {
                expect(screen.queryByRole('status')).not.toBeInTheDocument();
            });

            expect(consoleSpy).toHaveBeenCalledWith(
                'Failed to fetch tasks:',
                expect.any(Object)
            );

            consoleSpy.mockRestore();
        });
    });

    describe('Task Display', () => {
        it('should display task details correctly', async () => {
            render(<TasksPage />);

            await waitFor(() => {
                expect(screen.getByText('Buy groceries')).toBeInTheDocument();
            });

            // Check priority badge
            expect(screen.getByText('high priority')).toBeInTheDocument();

            // Check category
            expect(screen.getByText('shopping')).toBeInTheDocument();

            // Check reward
            expect(screen.getByText('10 SBD')).toBeInTheDocument();

            // Check description
            expect(screen.getByText('Get milk, bread, and eggs')).toBeInTheDocument();
        });

        it('should display assigned user if present', async () => {
            render(<TasksPage />);

            await waitFor(() => {
                expect(screen.getByText('Clean garage')).toBeInTheDocument();
            });

            expect(screen.getByText('Assigned to @John')).toBeInTheDocument();
        });

        it('should display due date if present', async () => {
            render(<TasksPage />);

            await waitFor(() => {
                expect(screen.getByText('Clean garage')).toBeInTheDocument();
            });

            expect(screen.getByText(/Due/)).toBeInTheDocument();
        });

        it('should display subtasks progress', async () => {
            render(<TasksPage />);

            await waitFor(() => {
                expect(screen.getByText('Water plants')).toBeInTheDocument();
            });

            // Check subtasks count
            expect(screen.getByText('Subtasks (1/2)')).toBeInTheDocument();
            expect(screen.getByText('Water indoor plants')).toBeInTheDocument();
            expect(screen.getByText('Water outdoor plants')).toBeInTheDocument();
        });

        it('should display task dependencies', async () => {
            render(<TasksPage />);

            await waitFor(() => {
                expect(screen.getByText('Finish homework')).toBeInTheDocument();
            });

            expect(screen.getByText('Depends on:')).toBeInTheDocument();
            expect(screen.getByText('Study for exam')).toBeInTheDocument();
        });

        it('should show completed tasks with line-through', async () => {
            render(<TasksPage />);

            await waitFor(() => {
                const completedTask = screen.getByText('Study for exam');
                expect(completedTask).toHaveClass('line-through');
            });
        });
    });

    describe('Task Actions', () => {
        it('should allow completing a task', async () => {
            (api.api.post as jest.Mock).mockResolvedValue({ data: {} });

            render(<TasksPage />);

            await waitFor(() => {
                expect(screen.getByText('Buy groceries')).toBeInTheDocument();
            });

            // Click mark complete button
            const pendingSection = screen.getByText('Pending Tasks').closest('div');
            const completeButton = within(pendingSection!).getAllByText('Mark Complete')[0];

            await userEvent.click(completeButton);

            // Should call complete API
            expect(api.api.post).toHaveBeenCalledWith('/tasks/task-1/complete');

            // Task should move to completed (visual update)
            await waitFor(() => {
                const task = screen.getByText('Buy groceries');
                expect(task).toHaveClass('line-through');
            });
        });

        it('should handle complete task error', async () => {
            (api.api.post as jest.Mock).mockRejectedValue({
                response: { data: { detail: 'Insufficient permissions' } },
            });

            const alertSpy = jest.spyOn(window, 'alert').mockImplementation();
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

            render(<TasksPage />);

            await waitFor(() => {
                expect(screen.getByText('Buy groceries')).toBeInTheDocument();
            });

            const completeButton = screen.getAllByText('Mark Complete')[0];
            await userEvent.click(completeButton);

            await waitFor(() => {
                expect(alertSpy).toHaveBeenCalledWith('Insufficient permissions');
            });

            alertSpy.mockRestore();
            consoleSpy.mockRestore();
        });
    });

    describe('Filtering', () => {
        it('should filter tasks by priority', async () => {
            render(<TasksPage />);

            await waitFor(() => {
                expect(screen.getByText('Buy groceries')).toBeInTheDocument();
            });

            // Select high priority filter
            const prioritySelect = screen.getByRole('combobox', { name: /priority/i });
            await userEvent.selectOptions(prioritySelect, 'high');

            // Should show only high priority tasks
            await waitFor(() => {
                expect(screen.getByText('Buy groceries')).toBeInTheDocument();
                expect(screen.getByText('Finish homework')).toBeInTheDocument();
                expect(screen.queryByText('Clean garage')).not.toBeInTheDocument();
                expect(screen.queryByText('Water plants')).not.toBeInTheDocument();
            });
        });

        it('should filter tasks by category', async () => {
            render(<TasksPage />);

            await waitFor(() => {
                expect(screen.getByText('Buy groceries')).toBeInTheDocument();
            });

            // Select chores category
            const categorySelect = screen.getByRole('combobox', { name: /category/i });
            await userEvent.selectOptions(categorySelect, 'chores');

            // Should show only chores
            await waitFor(() => {
                expect(screen.getByText('Clean garage')).toBeInTheDocument();
                expect(screen.getByText('Water plants')).toBeInTheDocument();
                expect(screen.queryByText('Buy groceries')).not.toBeInTheDocument();
            });
        });

        it('should combine multiple filters', async () => {
            render(<TasksPage />);

            await waitFor(() => {
                expect(screen.getByText('Buy groceries')).toBeInTheDocument();
            });

            // Select high priority + education category
            const prioritySelect = screen.getByRole('combobox', { name: /priority/i });
            const categorySelect = screen.getByRole('combobox', { name: /category/i });

            await userEvent.selectOptions(prioritySelect, 'high');
            await userEvent.selectOptions(categorySelect, 'education');

            // Should show only high priority education tasks
            await waitFor(() => {
                expect(screen.getByText('Finish homework')).toBeInTheDocument();
                expect(screen.queryByText('Buy groceries')).not.toBeInTheDocument();
            });
        });
    });

    describe('View Switching', () => {
        it('should switch between list and kanban views', async () => {
            render(<TasksPage />);

            await waitFor(() => {
                expect(screen.getByText('Family Tasks')).toBeInTheDocument();
            });

            // Initially in list view
            expect(screen.getByText('Pending Tasks')).toBeInTheDocument();

            // Switch to kanban
            const kanbanTab = screen.getByRole('tab', { name: /kanban/i });
            await userEvent.click(kanbanTab);

            // Should show kanban board
            await waitFor(() => {
                expect(screen.queryByText('Pending Tasks')).not.toBeInTheDocument();
                // Kanban board component should be rendered
            });
        });
    });

    describe('Empty States', () => {
        it('should show empty state when no pending tasks', async () => {
            const completedTasks = mockTasks.map(t => ({ ...t, status: 'completed' }));
            (api.api.get as jest.Mock).mockImplementation((url: string) => {
                if (url.includes('my-families')) return mockApiResponse(mockFamilies);
                if (url.includes('/tasks')) return mockApiResponse(completedTasks);
                return mockApiResponse([]);
            });

            render(<TasksPage />);

            await waitFor(() => {
                expect(screen.getByText('No pending tasks')).toBeInTheDocument();
            });
        });

        it('should show empty state when no in-progress tasks', async () => {
            render(<TasksPage />);

            await waitFor(() => {
                expect(screen.getByText('Family Tasks')).toBeInTheDocument();
            });

            // Filter to show only completed
            const prioritySelect = screen.getByRole('combobox', { name: /priority/i });
            await userEvent.selectOptions(prioritySelect, 'low');

            await waitFor(() => {
                expect(screen.getByText('No tasks in progress')).toBeInTheDocument();
            });
        });
    });
});
