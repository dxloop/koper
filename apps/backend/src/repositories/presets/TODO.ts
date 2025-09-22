import { Todo, TodoData } from "openapi"

/**
 * The properties to select for the base todo
 */
export const BASE_TODO = {
	title: true,
	description: true,
	status: true,
	dueDate: true,
	userId: true
} as Record<keyof TodoData, boolean>

/**
 * The type of the base todo based on the selected properties
 */
export type BASE_TODO_TYPE = Pick<TodoData, keyof typeof BASE_TODO>

/**
 * The properties to select for the full todo
 */
export const TODO = {
	...BASE_TODO,
	id: true
} as Record<keyof Todo, boolean>

/**
 * The type of the full todo based on the selected properties
 */
export type TODO_TYPE = Pick<Todo, keyof typeof TODO>

/**
 * The properties to select for the full todo with relations
 */
export const FULL_TODO = {
	...TODO,
	user: {
		select: {
			id: true,
			email: true,
			name: true
		}
	}
} as const

/**
 * The type of the full todo with relations based on the selected properties
 */
export type FULL_TODO_TYPE = Pick<Todo, keyof typeof TODO> & {
	user: {
		id: bigint
		email: string
		name: string
	}
}