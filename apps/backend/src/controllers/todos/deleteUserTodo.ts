import { restResources, restActions } from "openapi"
import { deleteTodo } from "../../repositories/todos/deleteTodo.js"
import { notAuthenticated } from "../../shared/errors/notAuthenticated.js"
import { notAuthorized } from "../../shared/errors/notAuthorized.js"
import { notFound } from "../../shared/errors/notFound.js"
import { internalError } from "../../shared/errors/internalError.js"
import { rejectWithError } from "../../shared/errors/rejectWithError.js"
import Handler from "../../zodios/requestHandler.js"
import { userAuthMissing } from "../../auth/userMiddelware.js"
import { getTodoWithIdAndUserId } from "../../repositories/todos/getTodo.js"

/**
 * Deletes a todo for a user.
 *
 * @param req - The Express request object.
 * @param res - The Express response object.
 */
const deleteUserTodoController: Handler<"delete", "/users/:userId/todos/:id"> = async (req, res) => {
    if (userAuthMissing(req)) return rejectWithError(res, notAuthenticated())

    const { userId, id } = req.params

    // Check if user is deleting their own todo
    if (req.user!.id.toString() !== userId.toString()) {
        return rejectWithError(res, notAuthorized(restResources.Todo))
    }

    try {
        const todo = await getTodoWithIdAndUserId(id.toString(), userId.toString())

        if (!todo) {
            return rejectWithError(res, notFound(restResources.Todo, "Todo not found"))
        }
        
        await deleteTodo(id.toString(), userId.toString())

        return res.status(204).send()
    } catch (error) {
        console.error("Error deleting todo:", error)

        return rejectWithError(res, internalError(restActions.Delete, restResources.Todo, "Failed to delete todo"))
    }
}

export default deleteUserTodoController