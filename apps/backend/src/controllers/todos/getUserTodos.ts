import { restResources, restActions } from "openapi"
import { getUserTodos } from "../../repositories/todos/getTodo.js"
import { notAuthenticated } from "../../shared/errors/notAuthenticated.js"
import { notAuthorized } from "../../shared/errors/notAuthorized.js"
import { internalError } from "../../shared/errors/internalError.js"
import { rejectWithError } from "../../shared/errors/rejectWithError.js"
import Handler from "../../zodios/requestHandler.js"
import { transformTodos } from "../../transformers/todo.js"
import { userAuthMissing } from "../../auth/userMiddelware.js"

/**
 * Gets paginated todos for a user.
 *
 * @param req - The Express request object.
 * @param res - The Express response object.
 */
const getUserTodosController: Handler<"get", "/users/:userId/todos"> = async (req, res) => {
	if (userAuthMissing(req)) return rejectWithError(res, notAuthenticated())

	const { userId } = req.params
	const { limit = 10, cursor } = req.query

	// Check if user is accessing their own todos
	if (req.user!.id.toString() !== userId.toString()) {
		return rejectWithError(res, notAuthorized(restResources.Todo))
	}

	try {
		const result = await getUserTodos(userId.toString(), Number(limit), cursor)
		
		return res.send({
			todos: transformTodos(result.todos),
			nextCursorId: result.nextCursorId,
			previousCursorId: result.previousCursorId
		})
	} catch (error) {
		console.error("Error fetching todos:", error)
		return rejectWithError(res, internalError(restActions.Fetch, restResources.Todo, "Failed to fetch todos"))
	}
}

export default getUserTodosController