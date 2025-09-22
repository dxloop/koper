import prisma from "../prisma.js"
import { TODO } from "../presets/TODO.js"
import { PromiseType } from "../../shared/types.js"
import { TodoData } from "openapi"
import { Prisma } from "database"

/* The type of the updated todo based on the selected properties */
export type UpdateTodo = PromiseType<ReturnType<typeof updateTodo>>

/**
 * Updates a todo
 * @param todoId - The id of the todo to update
 * @param userId - The id of the user updating the todo
 * @param todoData - The updated todo data
 * @returns The updated todo
 */
export async function updateTodo(todoId: string | bigint, userId: string | bigint, todoData: Partial<TodoData>) {
	const updateData: Prisma.XOR<Prisma.TodoUpdateInput, Prisma.TodoUncheckedUpdateInput> = {}
	
	if (todoData.title !== undefined) updateData.title = todoData.title
	if (todoData.description !== undefined) updateData.description = todoData.description
	if (todoData.status !== undefined) updateData.status = todoData.status
	if (todoData.dueDate !== undefined) updateData.dueDate = new Date(todoData.dueDate).toISOString();

	return await prisma.todo.update({
		select: TODO,
		where: {
			id: BigInt(todoId),
			userId: BigInt(userId)
		},
		data: updateData
	})
}