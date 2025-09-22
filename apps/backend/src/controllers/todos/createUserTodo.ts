import { restResources, restActions } from "openapi"
import { createTodo } from "../../repositories/todos/createTodo.js"
import { notAuthenticated } from "../../shared/errors/notAuthenticated.js"
import { notAuthorized } from "../../shared/errors/notAuthorized.js"
import { internalError } from "../../shared/errors/internalError.js"
import { rejectWithError } from "../../shared/errors/rejectWithError.js"
import Handler from "../../zodios/requestHandler.js"
import { transformTodo } from "../../transformers/todo.js"
import { userAuthMissing } from "../../auth/userMiddelware.js"

/**
 * Creates a new todo for a user.
 *
 * @param req - The Express request object.
 * @param res - The Express response object.
 */
const createUserTodoController: Handler<"post", "/users/:userId/todos"> = async (req, res) => {
	if (userAuthMissing(req)) return rejectWithError(res, notAuthenticated())

	const { userId } = req.params
	const todoData = req.body

	// Check if user is creating todo for themselves
	if (req.user!.id.toString() !== userId.toString()) {
		return rejectWithError(res, notAuthorized(restResources.Todo))
	}

	try {
		const todo = await createTodo(todoData, userId.toString())
		
		return res.status(201).send(transformTodo(todo))
	} catch (error) {
		console.error("Error creating todo:", error)
		return rejectWithError(res, internalError(restActions.Create, restResources.Todo, "Failed to create todo"))
	}
}

export default createUserTodoController