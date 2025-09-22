import { useState, useContext } from 'react';
import {
    Card,
    Group,
    Text,
    Badge,
    ActionIcon,
    Menu,
    Stack,
    Checkbox,
    Tooltip,
    rem,
} from '@mantine/core';
import { IconDots, IconEdit, IconTrash, IconCalendar, IconUser } from '@tabler/icons-react';
import { useUpdateUserTodo, useDeleteUserTodo, type Todo, type TodoDataStatus } from 'openapi';
import { notifications } from '@mantine/notifications';
import { useQueryClient } from '@tanstack/react-query';
import { UserContext } from '../../../context/UserContext';
import { TodoEditModal } from '../TodoEditModal/TodoEditModal';

interface TodoItemProps {
    todo: Todo;
    onUpdate: () => void;
    onDelete: () => void;
}

const statusColors: Record<TodoDataStatus, string> = {
    PENDING: 'yellow',
    IN_PROGRESS: 'blue',
    DONE: 'green',
};

const statusLabels: Record<TodoDataStatus, string> = {
    PENDING: 'Pending',
    IN_PROGRESS: 'In Progress',
    DONE: 'Done',
};

/**
 * TodoItem component to display a single todo item with options to edit or delete.
 * @param todo - The todo item to display
 * @param onUpdate - Callback function to call when the todo is updated
 * @param onDelete - Callback function to call when the todo is deleted
 * @returns The TodoItem component
 */
export function TodoItem({ todo, onUpdate, onDelete }: TodoItemProps) {
    const { user } = useContext(UserContext);
    const queryClient = useQueryClient();
    const [editModalOpened, setEditModalOpened] = useState(false);

    const invalidateAllTodoQueries = () => {
        queryClient.invalidateQueries({ queryKey: ['infinite-todos', user.id] });
        queryClient.invalidateQueries({ queryKey: ['todos', user.id] });
        onUpdate();
    };

    const updateMutation = useUpdateUserTodo(parseInt(user.id || '0'), parseInt(todo.id), {
        mutation: {
            onSuccess: () => {
                invalidateAllTodoQueries();
                notifications.show({
                    title: 'Success',
                    message: 'Todo updated successfully',
                    color: 'green',
                });
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

    const deleteMutation = useDeleteUserTodo(parseInt(user.id || '0'), parseInt(todo.id), {
        mutation: {
            onSuccess: () => {
                invalidateAllTodoQueries();
                onDelete();
                notifications.show({
                    title: 'Success',
                    message: 'Todo deleted successfully',
                    color: 'green',
                });
            },
            onError: (error) => {
                notifications.show({
                    title: 'Error',
                    message: error instanceof Error ? error.message : 'Failed to delete todo',
                    color: 'red',
                });
            },
        },
    });

    const handleStatusToggle = () => {
        const newStatus: TodoDataStatus = todo.status === 'DONE' ? 'PENDING' : 'DONE';
        updateMutation.mutate({
            title: todo.title,
            description: todo.description,
            status: newStatus,
            userId: todo.userId,
        });
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this todo?')) {
            try {
                // @ts-ignore - DELETE mutation doesn't require body
                await deleteMutation.mutateAsync();
            } catch (error) {
                // Error is already handled by the mutation's onError callback
            }
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return null;
        return new Date(dateString).toLocaleDateString();
    };

    const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date() && todo.status !== 'DONE';

    return (
        <>
            <Card
                shadow="sm"
                padding="md"
                radius="md"
                withBorder
                style={{
                    opacity: todo.status === 'DONE' ? 0.7 : 1,
                }}
            >
                <Group justify="space-between" align="flex-start">
                    <Group align="flex-start" gap="md" style={{ flex: 1 }}>
                        <Checkbox
                            checked={todo.status === 'DONE'}
                            onChange={handleStatusToggle}
                            disabled={updateMutation.isPending}
                            mt={2}
                        />

                        <Stack gap="xs" style={{ flex: 1 }}>
                            <Group justify="space-between" align="flex-start">
                                <Text
                                    fw={500}
                                    size="md"
                                    style={{
                                        textDecoration: todo.status === 'DONE' ? 'line-through' : 'none',
                                    }}
                                >
                                    {todo.title}
                                </Text>

                                <Group gap="xs">
                                    <Badge color={statusColors[todo.status]} variant="light" size="sm">
                                        {statusLabels[todo.status]}
                                    </Badge>

                                    {isOverdue && (
                                        <Badge color="red" variant="filled" size="sm">
                                            Overdue
                                        </Badge>
                                    )}
                                </Group>
                            </Group>

                            {todo.description && (
                                <Text
                                    size="sm"
                                    c="dimmed"
                                    style={{
                                        textDecoration: todo.status === 'DONE' ? 'line-through' : 'none',
                                    }}
                                >
                                    {todo.description}
                                </Text>
                            )}

                            <Group gap="xs">
                                {todo.dueDate && (
                                    <Group gap={4}>
                                        <IconCalendar size={14} />
                                        <Text size="xs" c="dimmed">
                                            Due: {formatDate(todo.dueDate)}
                                        </Text>
                                    </Group>
                                )}

                                <Group gap={4}>
                                    <IconUser size={14} />
                                    <Text size="xs" c="dimmed">
                                        ID: {todo.userId}
                                    </Text>
                                </Group>
                            </Group>
                        </Stack>
                    </Group>

                    <Menu shadow="md" width={200}>
                        <Menu.Target>
                            <ActionIcon variant="subtle" color="gray">
                                <IconDots style={{ width: rem(16), height: rem(16) }} />
                            </ActionIcon>
                        </Menu.Target>

                        <Menu.Dropdown>
                            <Menu.Item
                                leftSection={<IconEdit style={{ width: rem(14), height: rem(14) }} />}
                                onClick={() => setEditModalOpened(true)}
                                disabled={updateMutation.isPending}
                            >
                                Edit
                            </Menu.Item>

                            <Menu.Divider />

                            <Menu.Item
                                color="red"
                                leftSection={<IconTrash style={{ width: rem(14), height: rem(14) }} />}
                                onClick={handleDelete}
                                disabled={deleteMutation.isPending}
                            >
                                Delete
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                </Group>
            </Card>

            <TodoEditModal
                todo={todo}
                opened={editModalOpened}
                onClose={() => setEditModalOpened(false)}
                onUpdate={invalidateAllTodoQueries}
            />
        </>
    );
}
