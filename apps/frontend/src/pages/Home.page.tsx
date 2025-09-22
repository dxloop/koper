import { useState, useRef } from 'react';
import { Container, Stack, Title, Button, Group, Text, Paper } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { TodoList } from '../components/todo/TodoList/TodoList';
import { TodoCreateModal } from '../components/todo/TodoCreateModal/TodoCreateModal';
import {
  TodoFilters,
  type TodoFilters as TodoFiltersType,
} from '../components/todo/TodoFilters/TodoFilters';
import { TodoStats } from '../components/todo/TodoStats/TodoStats';
import { useInfiniteTodos } from '../hooks/useInfiniteTodos';

/**
 * HomePage component that displays the main todo management interface.
 * @returns The HomePage component
 */
export function HomePage() {
  const [createModalOpened, setCreateModalOpened] = useState(false);
  const [filters, setFilters] = useState<TodoFiltersType>({});

  // Get todos for stats
  const { todos } = useInfiniteTodos({ limit: 100 }); // Get more for accurate stats

  const handleFiltersChange = (newFilters: TodoFiltersType) => {
    setFilters(newFilters);
  };

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        <Paper p="lg" withBorder>
          <Group justify="space-between" align="center" mb="md">
            <div>
              <Title order={1} mb="xs">
                My Todos
              </Title>
              <Text c="dimmed" size="sm">
                Manage your tasks efficiently with full CRUD operations and infinite scrolling
              </Text>
            </div>
            <Button
              leftSection={<IconPlus size={16} />}
              onClick={() => setCreateModalOpened(true)}
              size="md"
            >
              Add Todo
            </Button>
          </Group>

          <Stack gap="md">
            <TodoStats todos={todos} />
            <TodoFilters onFiltersChange={handleFiltersChange} />
          </Stack>
        </Paper>

        <TodoList filters={filters} />

        <TodoCreateModal
          opened={createModalOpened}
          onClose={() => setCreateModalOpened(false)}
        />
      </Stack>
    </Container>
  );
}
