import { restResources, restActions } from "openapi"
import { getTodoWithIdAndUserId } from "../../repositories/todos/getTodo.js"
import { notAuthenticated } from "../../shared/errors/notAuthenticated.js"
import { notAuthorized } from "../../shared/errors/notAuthorized.js"
import { notFound } from "../../shared/errors/notFound.js"
import { internalError } from "../../shared/errors/internalError.js"
import { rejectWithError } from "../../shared/errors/rejectWithError.js"
import Handler from "../../zodios/requestHandler.js"
import { transformTodo } from "../../transformers/todo.js"
import { userAuthMissing } from "../../auth/userMiddelware.js"

/**
 * Gets a single todo for a user.
 *
 * @param req - The Express request object.
 * @param res - The Express response object.
 */
const getUserTodoController: Handler<"get", "/users/:userId/todos/:id"> = async (req, res) => {
	if (userAuthMissing(req)) return rejectWithError(res, notAuthenticated())

	const { userId, id } = req.params

	// Check if user is accessing their own todo
	if (req.user!.id.toString() !== userId.toString()) {
		return rejectWithError(res, notAuthorized(restResources.Todo))
	}

	try {
		const todo = await getTodoWithIdAndUserId(id.toString(), userId.toString())
		
		if (!todo) {
			return rejectWithError(res, notFound(restResources.Todo, "Todo not found"))
		}

		return res.send(transformTodo(todo))
	} catch (error) {
		console.error("Error fetching todo:", error)
		return rejectWithError(res, internalError(restActions.Fetch, restResources.Todo, "Failed to fetch todo"))
	}
}

export default getUserTodoController