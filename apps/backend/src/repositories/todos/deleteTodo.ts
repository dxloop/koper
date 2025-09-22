import prisma from "../prisma.js"
import { PromiseType } from "../../shared/types.js"

/* The type of the deleted todo based on the selected properties */
export type DeleteTodo = PromiseType<ReturnType<typeof deleteTodo>>

/**
 * Deletes a todo
 * @param todoId - The id of the todo to delete
 * @param userId - The id of the user deleting the todo
 * @returns The deleted todo information
 */
export async function deleteTodo(todoId: string | bigint, userId: string | bigint) {
	return await prisma.todo.delete({
		where: {
			id: BigInt(todoId),
			userId: BigInt(userId)
		},
		select: {
			id: true
		}
	})
}