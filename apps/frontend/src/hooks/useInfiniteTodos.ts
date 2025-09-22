import { useContext, useCallback, useMemo } from 'react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { getUserTodosQueryKey, type Todo, getUserTodos } from 'openapi';
import { UserContext } from '../context/UserContext';

interface UseInfiniteTodosOptions {
  limit?: number;
}

interface TodoPage {
  todos: Todo[];
  nextCursorId?: string;
  previousCursorId?: string;
}

/**
 * Custom hook to fetch todos with infinite scrolling support
 * @param options - Options for fetching todos, including limit
 * @returns An object containing the infinite query result and a method to invalidate queries
 */
export function useInfiniteTodos({ limit = 10 }: UseInfiniteTodosOptions = {}) {
  const { user } = useContext(UserContext);
  const queryClient = useQueryClient();

  const infiniteQuery = useInfiniteQuery<TodoPage>({
    queryKey: ['infinite-todos', user.id, limit],
    queryFn: async ({ pageParam }) => {
      const data = await getUserTodos(Number(user.id), { limit, cursor: pageParam as string });
      return {
        todos: data.todos || [],
        nextCursorId: data.nextCursorId,
        previousCursorId: data.previousCursorId,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextCursorId || undefined,
    initialPageParam: undefined,
    enabled: !!user.id,
  });

  // Flatten all todos from all pages
  const allTodos = useMemo(
    () => infiniteQuery.data?.pages.flatMap((page) => page.todos) || [],
    [infiniteQuery.data]
  );

  // Invalidate both infinite and regular todo queries
  const invalidateQueries = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['infinite-todos', user.id] });
    queryClient.invalidateQueries({ queryKey: getUserTodosQueryKey(parseInt(user.id || '0')) });
  }, [queryClient, user.id]);

  return {
    ...infiniteQuery,
    todos: allTodos,
    invalidateQueries,
  };
}
