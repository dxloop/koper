import { restResources, restActions } from "openapi"
import { updateTodo } from "../../repositories/todos/updateTodo.js"
import { notAuthenticated } from "../../shared/errors/notAuthenticated.js"
import { notAuthorized } from "../../shared/errors/notAuthorized.js"
import { notFound } from "../../shared/errors/notFound.js"
import { internalError } from "../../shared/errors/internalError.js"
import { rejectWithError } from "../../shared/errors/rejectWithError.js"
import Handler from "../../zodios/requestHandler.js"
import { transformTodo } from "../../transformers/todo.js"
import { userAuthMissing } from "../../auth/userMiddelware.js"
import { getTodoWithIdAndUserId } from "../../repositories/todos/getTodo.js"

/**
 * Updates a todo for a user.
 *
 * @param req - The Express request object.
 * @param res - The Express response object.
 */
const updateUserTodoController: Handler<"put", "/users/:userId/todos/:id"> = async (req, res) => {
    if (userAuthMissing(req)) return rejectWithError(res, notAuthenticated())

    const { userId, id } = req.params
    const todoData = req.body

    // Check if user is updating their own todo
    if (req.user!.id.toString() !== userId.toString()) {
        return rejectWithError(res, notAuthorized(restResources.Todo))
    }

    try {
        const checkTodo = await getTodoWithIdAndUserId(id.toString(), userId.toString())

        if (!checkTodo) {
            return rejectWithError(res, notFound(restResources.Todo, "Todo not found"))
        }

        const todo = await updateTodo(id.toString(), userId.toString(), todoData)

        return res.send(transformTodo(todo))
    } catch (error) {
        console.error("Error updating todo:", error)

        return rejectWithError(res, internalError(restActions.Update, restResources.Todo, "Failed to update todo"))
    }
}

export default updateUserTodoController