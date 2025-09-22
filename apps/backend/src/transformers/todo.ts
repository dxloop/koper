import { CreateTodo } from "../repositories/todos/createTodo.js"
import { GetTodo } from "../repositories/todos/getTodo.js"
import { UpdateTodo } from "../repositories/todos/updateTodo.js"
import { Todo } from "openapi"

/**
 * Returns the api todo object based on the provided data from the database
 * @param data - The todo data
 * @returns The api todo object
 */
export function transformTodo(data: CreateTodo | GetTodo | UpdateTodo): Todo {
	if (data === null) throw new Error("Failed to transform todo data")
	return {
		id: data!.id.toString(),
		title: data.title,
		description: data.description || undefined,
		status: data.status,
		dueDate: data.dueDate ? data.dueDate.toISOString() : undefined,
		userId: data.userId.toString()
	}
}

/**
 * Returns an array of api todo objects based on the provided data from the database
 * @param data - The array of todo data
 * @returns The array of api todo objects
 */
export function transformTodos(data: (CreateTodo | GetTodo | UpdateTodo)[]): Todo[] {
	return data.map(todo => transformTodo(todo))
}