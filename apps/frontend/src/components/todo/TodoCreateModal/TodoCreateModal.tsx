import { useContext } from 'react';
import { Modal, Stack, TextInput, Textarea, Select, Button, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useCreateUserTodo, type TodoDataStatus } from 'openapi';
import { notifications } from '@mantine/notifications';
import { useQueryClient } from '@tanstack/react-query';
import { UserContext } from '../../../context/UserContext';

interface TodoCreateModalProps {
  opened: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface TodoFormData {
  title: string;
  description?: string;
  status: TodoDataStatus;
  dueDate?: string;
}

const statusOptions = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'DONE', label: 'Done' },
];

/**
 * TodoCreateModal component to create a new todo item.
 * @param opened - Whether the modal is open
 * @param onClose - Function to call when the modal is closed
 * @param onSuccess - Optional function to call after a successful creation
 * @returns The TodoCreateModal component
 */
export function TodoCreateModal({ opened, onClose, onSuccess }: TodoCreateModalProps) {
  const { user } = useContext(UserContext);
  const queryClient = useQueryClient();

  const form = useForm<TodoFormData>({
    initialValues: {
      title: '',
      description: '',
      status: 'PENDING',
      dueDate: '',
    },
    validate: {
      title: (value) => {
        if (!value || value.trim().length === 0) {
          return 'Title is required';
        }
        if (value.length > 100) {
          return 'Title must be less than 100 characters';
        }
        return null;
      },
      description: (value) => {
        if (value && value.length > 500) {
          return 'Description must be less than 500 characters';
        }
        return null;
      },
      dueDate: (value) => {
        if (value && !isValidDate(value)) {
          return 'Please enter a valid date';
        }
        return null;
      },
    },
  });

  const createMutation = useCreateUserTodo(Number(user.id || '0'), {
    mutation: {
      onSuccess: () => {
        notifications.show({
          title: 'Success',
          message: 'Todo created successfully',
          color: 'green',
        });

        // Invalidate all todo-related queries
        queryClient.invalidateQueries({ queryKey: ['infinite-todos', user.id] });
        queryClient.invalidateQueries({ queryKey: ['todos', user.id] });

        form.reset();
        onClose();
        onSuccess?.();
      },
      onError: (error) => {
        notifications.show({
          title: 'Error',
          message: error instanceof Error ? error.message : 'Failed to create todo',
          color: 'red',
        });
      },
    },
  });

  const isValidDate = (dateString: string): boolean => {
    if (!dateString) return true; // Optional field
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  };

  const handleSubmit = (values: TodoFormData) => {
    createMutation.mutate({
      title: values.title.trim(),
      description: values.description?.trim() || undefined,
      status: values.status,
      dueDate: values.dueDate || undefined,
      userId: user.id || '',
    });
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="Create New Todo"
      size="md"
      closeOnClickOutside={!createMutation.isPending}
      closeOnEscape={!createMutation.isPending}
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <TextInput
            label="Title"
            placeholder="Enter todo title"
            withAsterisk
            {...form.getInputProps('title')}
            disabled={createMutation.isPending}
          />

          <Textarea
            label="Description"
            placeholder="Enter todo description (optional)"
            rows={3}
            maxRows={5}
            autosize
            {...form.getInputProps('description')}
            disabled={createMutation.isPending}
          />

          <Select
            label="Status"
            data={statusOptions}
            {...form.getInputProps('status')}
            disabled={createMutation.isPending}
          />

          <TextInput
            label="Due Date"
            placeholder="YYYY-MM-DD (optional)"
            type="date"
            {...form.getInputProps('dueDate')}
            disabled={createMutation.isPending}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="subtle" onClick={handleClose} disabled={createMutation.isPending}>
              Cancel
            </Button>
            <Button type="submit" loading={createMutation.isPending}>
              Create Todo
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
