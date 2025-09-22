import { useState } from 'react';
import {
  Paper,
  Group,
  Select,
  TextInput,
  ActionIcon,
  Stack,
  Text,
  Collapse,
  Badge,
} from '@mantine/core';
import { IconSearch, IconFilter, IconX } from '@tabler/icons-react';
import { type TodoDataStatus } from 'openapi';

interface TodoFiltersProps {
  onFiltersChange: (filters: TodoFilters) => void;
}

export interface TodoFilters {
  search?: string;
  status?: TodoDataStatus | 'ALL';
  overdue?: boolean;
}

const statusOptions = [
  { value: 'ALL', label: 'All Statuses' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'DONE', label: 'Done' },
];

const overdueOptions = [
  { value: 'all', label: 'All' },
  { value: 'overdue', label: 'Overdue Only' },
  { value: 'not-overdue', label: 'Not Overdue' },
];

/**
 * TodoFilters component to manage and display filters for the todo list.
 * @param onFiltersChange - Callback function to call when filters change
 * @returns The TodoFilters component
 */
export function TodoFilters({ onFiltersChange }: TodoFiltersProps) {
  const [expanded, setExpanded] = useState(false);
  const [filters, setFilters] = useState<TodoFilters>({
    search: '',
    status: 'ALL',
    overdue: undefined,
  });

  const updateFilters = (newFilters: Partial<TodoFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const clearFilters = () => {
    const clearedFilters: TodoFilters = {
      search: '',
      status: 'ALL',
      overdue: undefined,
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = () =>
    (filters.search && filters.search.length > 0) ||
    (filters.status && filters.status !== 'ALL') ||
    filters.overdue !== undefined;

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.search && filters.search.length > 0) count++;
    if (filters.status && filters.status !== 'ALL') count++;
    if (filters.overdue !== undefined) count++;
    return count;
  };

  return (
    <Paper p="md" withBorder>
      <Stack gap="md">
        <Group justify="space-between" align="center">
          <Group gap="xs">
            <ActionIcon
              variant={expanded ? 'filled' : 'subtle'}
              onClick={() => setExpanded(!expanded)}
            >
              <IconFilter size={16} />
            </ActionIcon>
            <Text fw={500}>Filters</Text>
            {hasActiveFilters() && (
              <Badge size="sm" variant="light" color="blue">
                {getActiveFilterCount()}
              </Badge>
            )}
          </Group>

          {hasActiveFilters() && (
            <ActionIcon variant="subtle" color="gray" onClick={clearFilters} size="sm">
              <IconX size={14} />
            </ActionIcon>
          )}
        </Group>

        <TextInput
          placeholder="Search todos..."
          leftSection={<IconSearch size={16} />}
          value={filters.search}
          onChange={(event) => updateFilters({ search: event.currentTarget.value })}
          rightSection={
            filters.search && (
              <ActionIcon
                variant="subtle"
                color="gray"
                onClick={() => updateFilters({ search: '' })}
                size="sm"
              >
                <IconX size={14} />
              </ActionIcon>
            )
          }
        />

        <Collapse in={expanded}>
          <Stack gap="md">
            <Group grow>
              <Select
                label="Status"
                data={statusOptions}
                value={filters.status}
                onChange={(value) =>
                  updateFilters({ status: (value as TodoDataStatus | 'ALL') || 'ALL' })
                }
                clearable={false}
              />

              <Select
                label="Due Date"
                placeholder="All"
                data={overdueOptions}
                value={
                  filters.overdue === true
                    ? 'overdue'
                    : filters.overdue === false
                      ? 'not-overdue'
                      : 'all'
                }
                onChange={(value) => {
                  const overdueFilter =
                    value === 'overdue' ? true : value === 'not-overdue' ? false : undefined;
                  updateFilters({ overdue: overdueFilter });
                }}
                clearable
              />
            </Group>
          </Stack>
        </Collapse>
      </Stack>
    </Paper>
  );
}
