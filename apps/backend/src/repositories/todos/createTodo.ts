import prisma from "../prisma.js"
import { TODO } from "../presets/TODO.js"
import { PromiseType } from "../../shared/types.js"
import { TodoData } from "openapi"

/* The type of the created todo based on the selected properties */
export type CreateTodo = PromiseType<ReturnType<typeof createTodo>>

/**
 * Creates a new todo
 * @param todoData - The todo data to create
 * @param userId - The id of the user creating the todo
 * @returns The created todo
 */
export async function createTodo(todoData: TodoData, userId: string | bigint) {
	return await prisma.todo.create({
		select: TODO,
		data: {
			title: todoData.title,
			description: todoData.description,
			status: todoData.status,
			dueDate: todoData.dueDate ? new Date(todoData.dueDate) : new Date(),
			userId: BigInt(userId)
		}
	})
}