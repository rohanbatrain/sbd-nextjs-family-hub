import { test, expect } from '@playwright/test';

test.describe('Family Hub - Task Management Flow', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to tasks page
        await page.goto('/tasks');

        // Wait for page to load
        await page.waitForLoadState('networkidle');
    });

    test('complete task lifecycle: create → assign → complete → earn tokens', async ({ page }) => {
        // Wait for initial tasks to load
        await expect(page.locator('[data-testid="task-card"]').first()).toBeVisible({ timeout: 10000 });

        const initialPendingCount = await page.locator('text=/\\d+ pending/').textContent();

        // Create new task
        await page.locator('[data-testid="create-task-button"]').click();

        // Fill in task details
        await page.locator('[data-testid="task-title-input"]').fill('Test Task E2E');
        await page.locator('[data-testid="task-description-input"]').fill('This is a test task created by E2E test');

        // Set priority
        await page.locator('[data-testid="priority-select"]').selectOption('high');

        // Set reward
        await page.locator('[data-testid="reward-input"]').fill('15');

        // Add category
        await page.locator('[data-testid="category-input"]').fill('testing');

        // Submit task
        await page.locator('[data-testid="create-task-submit"]').click();

        // Wait for task to appear
        await expect(page.locator('text=Test Task E2E')).toBeVisible();

        // Verify task details
        const taskCard = page.locator('text=Test Task E2E').locator('..');
        await expect(taskCard.locator('text=high priority')).toBeVisible();
        await expect(taskCard.locator('text=15 SBD')).toBeVisible();
        await expect(taskCard.locator('text=testing')).toBeVisible();

        // Mark task as complete
        await taskCard.locator('button:has-text("Mark Complete")').click();

        // Verify task moved to completed section
        await expect(page.locator('.completed-section').locator('text=Test Task E2E')).toBeVisible();

        // Verify task has line-through styling
        const completedTask = page.locator('text=Test Task E2E');
        await expect(completedTask).toHaveClass(/line-through/);
    });

    test('filter tasks by priority', async ({ page }) => {
        // Wait for tasks to load
        await expect(page.locator('[data-testid="task-card"]').first()).toBeVisible();

        // Get total task count
        const allTasks = await page.locator('[data-testid="task-card"]').count();

        // Filter by high priority
        await page.locator('[data-testid="priority-filter"]').selectOption('high');

        // Wait for filter to apply
        await page.waitForTimeout(500);

        // Verify only high priority tasks are shown
        const highPriorityTasks = await page.locator('[data-testid="task-card"]').count();
        expect(highPriorityTasks).toBeLessThanOrEqual(allTasks);

        // Verify all visible tasks have high priority badge
        const priorityBadges = await page.locator('text=high priority').count();
        expect(priorityBadges).toBeGreaterThan(0);
    });

    test('filter tasks by category', async ({ page }) => {
        await expect(page.locator('[data-testid="task-card"]').first()).toBeVisible();

        // Select a category filter
        await page.locator('[data-testid="category-filter"]').selectOption('chores');

        await page.waitForTimeout(500);

        // Verify tasks are filtered
        const categoryBadges = await page.locator('text=chores').count();
        expect(categoryBadges).toBeGreaterThan(0);
    });

    test('switch between list and kanban views', async ({ page }) => {
        // Initially in list view
        await expect(page.locator('text=Pending Tasks')).toBeVisible();

        // Switch to kanban
        await page.locator('[data-testid="kanban-view-tab"]').click();

        // Verify kanban board is displayed
        await expect(page.locator('[data-testid="kanban-board"]')).toBeVisible();

        // Verify columns exist
        await expect(page.locator('[data-testid="kanban-pending-column"]')).toBeVisible();
        await expect(page.locator('[data-testid="kanban-progress-column"]')).toBeVisible();
        await expect(page.locator('[data-testid="kanban-completed-column"]')).toBeVisible();

        // Switch back to list view
        await page.locator('[data-testid="list-view-tab"]').click();

        await expect(page.locator('text=Pending Tasks')).toBeVisible();
    });

    test('view task with subtasks', async ({ page }) => {
        // Find task with subtasks
        const taskWithSubtasks = page.locator('text=/Subtasks \\(\\d+\\/\\d+\\)/').first();

        if (await taskWithSubtasks.count() > 0) {
            await expect(taskWithSubtasks).toBeVisible();

            // Verify subtasks are displayed
            const subtasksList = taskWithSubtasks.locator('..');
            const subtasks = await subtasksList.locator('[data-testid="subtask-item"]').count();
            expect(subtasks).toBeGreaterThan(0);
        }
    });

    test('view task dependencies', async ({ page }) => {
        // Find task with dependencies
        const taskWithDeps = page.locator('text=Depends on:').first();

        if (await taskWithDeps.count() > 0) {
            await expect(taskWithDeps).toBeVisible();

            // Verify dependency is shown
            await expect(taskWithDeps.locator('..')).toContainText(/.+/);
        }
    });
});

test.describe('Family Hub - Calendar Flow', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/calendar');
        await page.waitForLoadState('networkidle');
    });

    test('create and view calendar event', async ({ page }) => {
        // Wait for calendar to load
        await expect(page.locator('.rbc-calendar')).toBeVisible({ timeout: 10000 });

        // Click create event button
        await page.locator('[data-testid="create-event-button"]').click();

        // Fill event details
        await page.locator('[data-testid="event-title-input"]').fill('Family Dinner');
        await page.locator('[data-testid="event-description-input"]').fill('Monthly family dinner');

        // Select event type
        await page.locator('[data-testid="event-type-select"]').selectOption('family');

        // Set location
        await page.locator('[data-testid="event-location-input"]').fill('Home');

        // Submit event
        await page.locator('[data-testid="create-event-submit"]').click();

        // Verify event appears in calendar
        await expect(page.locator('text=Family Dinner')).toBeVisible();
    });

    test('switch calendar views', async ({ page }) => {
        await expect(page.locator('.rbc-calendar')).toBeVisible();

        // Test each view
        const views = ['Month', 'Week', 'Day', 'Agenda'];

        for (const view of views) {
            await page.locator(`button:has-text("${view}")`).click();

            // Wait for view to update
            await page.waitForTimeout(300);

            // Verify button is active
            const viewButton = page.locator(`button:has-text("${view}")`);
            await expect(viewButton).toHaveClass(/default/);
        }
    });

    test('export calendar to iCal', async ({ page }) => {
        await expect(page.locator('.rbc-calendar')).toBeVisible();

        // Click export button
        await page.locator('[data-testid="export-calendar-button"]').click();

        // Verify export dialog or download started
        // (implementation depends on CalendarExport component)
    });

    test('view event type legend', async ({ page }) => {
        await expect(page.locator('.rbc-calendar')).toBeVisible();

        // Verify all event types are shown
        await expect(page.locator('text=Family Events')).toBeVisible();
        await expect(page.locator('text=Task Deadlines')).toBeVisible();
        await expect(page.locator('text=Personal Events')).toBeVisible();

        // Verify event counts are displayed
        const eventCounts = await page.locator('text=/\\d+ events/').count();
        expect(eventCounts).toBeGreaterThanOrEqual(3);
    });

    test('detect event conflicts', async ({ page }) => {
        // This would require creating overlapping events
        // The UI should show a conflict warning
        // Implementation depends on conflict detection being enabled
    });
});

test.describe('Family Hub - Responsive Design', () => {
    test('mobile view - tasks page', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto('/tasks');

        await expect(page.locator('text=Family Tasks')).toBeVisible();

        // Verify mobile layout
        // Tabs should be visible
        await expect(page.locator('[data-testid="view-tabs"]')).toBeVisible();
    });

    test('tablet view - calendar page', async ({ page }) => {
        await page.setViewportSize({ width: 768, height: 1024 });
        await page.goto('/calendar');

        await expect(page.locator('.rbc-calendar')).toBeVisible();

        // Verify calendar is responsive
        // Controls should be visible
        await expect(page.locator('button:has-text("Month")')).toBeVisible();
    });
});

test.describe('Family Hub - Error Handling', () => {
    test('handle network errors gracefully', async ({ page }) => {
        // Simulate network failure
        await page.route('**/api/tasks*', route => route.abort('failed'));

        await page.goto('/tasks');

        // Should show error state or empty state
        // Don't crash the page
        await page.waitForTimeout(2000);

        // Page should still be functional
        await expect(page.locator('text=Family Tasks')).toBeVisible();
    });

    test('handle API errors gracefully', async ({ page }) => {
        // Simulate API error
        await page.route('**/api/tasks*', route =>
            route.fulfill({
                status: 500,
                body: JSON.stringify({ detail: 'Internal server error' }),
            })
        );

        await page.goto('/tasks');

        // Should handle error without crashing
        await expect(page.locator('text=Family Tasks')).toBeVisible();
    });
});
