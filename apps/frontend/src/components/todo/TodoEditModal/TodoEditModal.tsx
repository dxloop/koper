import { useContext, useEffect } from 'react';
import { Modal, Stack, TextInput, Textarea, Select, Button, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useUpdateUserTodo, type Todo, type TodoDataStatus } from 'openapi';
import { notifications } from '@mantine/notifications';
import { useQueryClient } from '@tanstack/react-query';
import { UserContext } from '../../../context/UserContext';

interface TodoEditModalProps {
  todo: Todo;
  opened: boolean;
  onClose: () => void;
  onUpdate: () => void;
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
 * TodoEditModal component to edit an existing todo item.
 * @param todo - The todo item to edit
 * @param opened - Whether the modal is open
 * @param onClose - Function to call when the modal is closed
 * @param onUpdate - Function to call after a successful update
 * @returns The TodoEditModal component
 */
export function TodoEditModal({ todo, opened, onClose, onUpdate }: TodoEditModalProps) {
  const { user } = useContext(UserContext);
  const queryClient = useQueryClient();

  const form = useForm<TodoFormData>({
    initialValues: {
      title: todo.title,
      description: todo.description || '',
      status: todo.status,
      dueDate: todo.dueDate ? todo.dueDate.split('T')[0] : '', // Convert ISO to YYYY-MM-DD format
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

  // Update form values when todo changes
  useEffect(() => {
    form.setValues({
      title: todo.title,
      description: todo.description || '',
      status: todo.status,
      dueDate: todo.dueDate ? todo.dueDate.split('T')[0] : '',
    });
  }, [todo]);

  const updateMutation = useUpdateUserTodo(parseInt(user.id || '0'), parseInt(todo.id), {
    mutation: {
      onSuccess: () => {
        notifications.show({
          title: 'Success',
          message: 'Todo updated successfully',
          color: 'green',
        });

        // Invalidate all todo-related queries
        queryClient.invalidateQueries({ queryKey: ['infinite-todos', user.id] });
        queryClient.invalidateQueries({ queryKey: ['todos', user.id] });

        onClose();
        onUpdate();
      },
      onError: (error) => {
        notifications.show({
          title: 'Error',
          message: error instanceof Error ? error.message : 'Failed to update todo',
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
    updateMutation.mutate({
      title: values.title.trim(),
      description: values.description?.trim() || undefined,
      status: values.status,
      dueDate: values.dueDate || undefined,
      userId: todo.userId,
    });
  };

  const handleClose = () => {
    // Reset form to original values when closing
    form.setValues({
      title: todo.title,
      description: todo.description || '',
      status: todo.status,
      dueDate: todo.dueDate ? todo.dueDate.split('T')[0] : '',
    });
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="Edit Todo"
      size="md"
      closeOnClickOutside={!updateMutation.isPending}
      closeOnEscape={!updateMutation.isPending}
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <TextInput
            label="Title"
            placeholder="Enter todo title"
            withAsterisk
            {...form.getInputProps('title')}
            disabled={updateMutation.isPending}
          />

          <Textarea
            label="Description"
            placeholder="Enter todo description (optional)"
            rows={3}
            maxRows={5}
            autosize
            {...form.getInputProps('description')}
            disabled={updateMutation.isPending}
          />

          <Select
            label="Status"
            data={statusOptions}
            {...form.getInputProps('status')}
            disabled={updateMutation.isPending}
          />

          <TextInput
            label="Due Date"
            placeholder="YYYY-MM-DD (optional)"
            type="date"
            {...form.getInputProps('dueDate')}
            disabled={updateMutation.isPending}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="subtle" onClick={handleClose} disabled={updateMutation.isPending}>
              Cancel
            </Button>
            <Button type="submit" loading={updateMutation.isPending}>
              Update Todo
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
