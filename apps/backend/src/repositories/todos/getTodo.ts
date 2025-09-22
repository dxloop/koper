import prisma from "../prisma.js"
import { TODO, FULL_TODO } from "../presets/TODO.js"
import { PromiseType } from "../../shared/types.js"

/* The type of the todo based on the selected properties */
export type GetTodo = PromiseType<ReturnType<typeof getTodoWithId | typeof getTodoWithIdAndUserId>>

/**
 * Gets all todos for a user with pagination
 * @param userId - The id of the user
 * @param limit - The maximum number of todos to return
 * @param cursor - The cursor for pagination
 * @returns The todos with pagination info
 */
export async function getUserTodos(userId: string | bigint, limit: number = 10, cursor?: string) {
	const where = {
		userId: BigInt(userId),
		...(cursor && { id: { gt: BigInt(cursor) } })
	}

	const todos = await prisma.todo.findMany({
		select: TODO,
		where,
		orderBy: { id: "asc" },
		take: limit + 1 // Take one extra to check if there are more
	})

	const hasMore = todos.length > limit
	const items = hasMore ? todos.slice(0, -1) : todos
	
	const nextCursorId = hasMore ? items[items.length - 1]?.id.toString() : undefined
	const previousCursorId = cursor

	return {
		todos: items,
		nextCursorId,
		previousCursorId
	}
}

/**
 * Gets the todo with the provided id
 * @param todoId - The id of the todo
 * @returns The todo
 */
export async function getTodoWithId(todoId: string | bigint) {
	return await prisma.todo.findUnique({
		select: FULL_TODO,
		where: {
			id: BigInt(todoId)
		}
	})
}

/**
 * Gets the todo with the provided id and user id
 * @param todoId - The id of the todo
 * @param userId - The id of the user
 * @returns The todo
 */
export async function getTodoWithIdAndUserId(todoId: string | bigint, userId: string | bigint) {
	return await prisma.todo.findFirst({
		select: FULL_TODO,
		where: {
			id: BigInt(todoId),
			userId: BigInt(userId)
		}
	})
}