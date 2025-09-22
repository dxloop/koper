import { useMemo } from 'react';
import { Paper, Group, Text, Badge, Stack, SimpleGrid } from '@mantine/core';
import { IconListCheck, IconClock, IconCheckbox, IconProgress } from '@tabler/icons-react';
import { type Todo } from 'openapi';

interface TodoStatsProps {
  todos: Todo[];
}

/**
 * TodoStats component to display statistics about todos.
 * @param todos - Array of todo items to calculate statistics from
 * @returns The TodoStats component
 */
export function TodoStats({ todos }: TodoStatsProps) {
  const stats = useMemo(() => {
    const total = todos.length;
    const pending = todos.filter((todo) => todo.status === 'PENDING').length;
    const inProgress = todos.filter((todo) => todo.status === 'IN_PROGRESS').length;
    const done = todos.filter((todo) => todo.status === 'DONE').length;

    const now = new Date();
    const overdue = todos.filter(
      (todo) => todo.dueDate && new Date(todo.dueDate) < now && todo.status !== 'DONE'
    ).length;

    const completionRate = total > 0 ? Math.round((done / total) * 100) : 0;

    return {
      total,
      pending,
      inProgress,
      done,
      overdue,
      completionRate,
    };
  }, [todos]);

  const statItems = [
    {
      icon: <IconListCheck size={20} />,
      label: 'Total',
      value: stats.total,
      color: 'blue',
    },
    {
      icon: <IconClock size={20} />,
      label: 'Pending',
      value: stats.pending,
      color: 'yellow',
    },
    {
      icon: <IconProgress size={20} />,
      label: 'In Progress',
      value: stats.inProgress,
      color: 'cyan',
    },
    {
      icon: <IconCheckbox size={20} />,
      label: 'Completed',
      value: stats.done,
      color: 'green',
    },
  ];

  return (
    <Paper p="md" withBorder>
      <Stack gap="md">
        <Group justify="space-between" align="center">
          <Text fw={500} size="sm">
            Todo Statistics
          </Text>
          <Group gap="xs">
            {stats.overdue > 0 && (
              <Badge color="red" variant="filled" size="sm">
                {stats.overdue} Overdue
              </Badge>
            )}
            <Badge variant="light" color="blue" size="sm">
              {stats.completionRate}% Complete
            </Badge>
          </Group>
        </Group>

        <SimpleGrid cols={4} spacing="xs">
          {statItems.map((item) => (
            <Group key={item.label} gap="xs" justify="center">
              <div style={{ color: `var(--mantine-color-${item.color}-6)` }}>{item.icon}</div>
              <Stack gap={0} align="center">
                <Text fw={700} size="lg">
                  {item.value}
                </Text>
                <Text size="xs" c="dimmed">
                  {item.label}
                </Text>
              </Stack>
            </Group>
          ))}
        </SimpleGrid>
      </Stack>
    </Paper>
  );
}
