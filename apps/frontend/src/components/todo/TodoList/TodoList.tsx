import { useEffect, useMemo } from 'react';
import { Stack, Alert, Loader, Center, Text, Group, Button } from '@mantine/core';
import { IconAlertCircle, IconRefresh } from '@tabler/icons-react';
import { useIntersection } from '@mantine/hooks';
import { type Todo } from 'openapi';
import { TodoItem } from '../TodoItem/TodoItem';
import { useInfiniteTodos } from '../../../hooks/useInfiniteTodos';
import { type TodoFilters } from '../TodoFilters/TodoFilters';

interface TodoListProps {
  limit?: number;
  filters?: TodoFilters;
}

/**
 * TodoList component to display a list of todos with infinite scrolling and filtering.
 * @param limit - Number of todos to fetch per page (default is 10)
 * @param filters - Filters to apply to the todo list
 * @returns The TodoList component
 */
export function TodoList({ limit = 10, filters = {} }: TodoListProps) {
  const { ref: intersectionRef, entry } = useIntersection({
    root: null,
    threshold: 1,
  });

  const {
    todos: allTodos,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
    invalidateQueries,
  } = useInfiniteTodos({ limit });

  // Filter todos based on the provided filters
  const filteredTodos = useMemo(() => {
    let result = allTodos;

    // Search filter
    if (filters.search && filters.search.trim().length > 0) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(
        (todo: Todo) =>
          todo.title.toLowerCase().includes(searchTerm) ||
          (todo.description && todo.description.toLowerCase().includes(searchTerm))
      );
    }

    // Status filter
    if (filters.status && filters.status !== 'ALL') {
      result = result.filter((todo: Todo) => todo.status === filters.status);
    }

    // Overdue filter
    if (filters.overdue !== undefined) {
      const now = new Date();
      result = result.filter((todo: Todo) => {
        if (!todo.dueDate) return !filters.overdue; // No due date means not overdue
        const isOverdue = new Date(todo.dueDate) < now && todo.status !== 'DONE';
        return filters.overdue ? isOverdue : !isOverdue;
      });
    }

    return result;
  }, [allTodos, filters]);

  // Trigger loading more when intersection is observed
  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [entry?.isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <Center py="xl">
        <Loader size="lg" />
      </Center>
    );
  }

  if (isError) {
    return (
      <Alert
        icon={<IconAlertCircle size={16} />}
        title="Error loading todos"
        color="red"
        variant="light"
      >
        <Stack gap="sm">
          <Text size="sm">
            {error instanceof Error ? error.message : 'Failed to load todos. Please try again.'}
          </Text>
          <Group>
            <Button
              size="xs"
              variant="light"
              leftSection={<IconRefresh size={14} />}
              onClick={() => refetch()}
            >
              Retry
            </Button>
          </Group>
        </Stack>
      </Alert>
    );
  }

  if (allTodos.length === 0) {
    return (
      <Center py="xl">
        <Stack align="center" gap="md">
          <Text size="lg" c="dimmed">
            No todos found
          </Text>
          <Text size="sm" c="dimmed">
            Create your first todo to get started!
          </Text>
        </Stack>
      </Center>
    );
  }

  if (filteredTodos.length === 0 && allTodos.length > 0) {
    return (
      <Center py="xl">
        <Stack align="center" gap="md">
          <Text size="lg" c="dimmed">
            No todos match your filters
          </Text>
          <Text size="sm" c="dimmed">
            Try adjusting your search criteria or clear the filters.
          </Text>
        </Stack>
      </Center>
    );
  }

  return (
    <Stack gap="sm">
      {filteredTodos.map((todo, index) => (
        <div key={todo.id} ref={index === filteredTodos.length - 1 ? intersectionRef : undefined}>
          <TodoItem todo={todo} onUpdate={invalidateQueries} onDelete={invalidateQueries} />
        </div>
      ))}

      {isFetchingNextPage && (
        <Center py="md">
          <Loader size="md" />
        </Center>
      )}

      {!hasNextPage && allTodos.length > 0 && (
        <Center py="md">
          <Text size="sm" c="dimmed">
            {filteredTodos.length === allTodos.length
              ? 'No more todos to load'
              : `Showing ${filteredTodos.length} of ${allTodos.length} todos`}
          </Text>
        </Center>
      )}
    </Stack>
  );
}
