import { restResources } from "openapi"
import { getUserWithId } from "../../repositories/users/getUser.js"
import { notAuthenticated } from "../../shared/errors/notAuthenticated.js"
import { notFound } from "../../shared/errors/notFound.js"
import { rejectWithError } from "../../shared/errors/rejectWithError.js"
import Handler from "../../zodios/requestHandler.js"
import { transformUser } from "../../transformers/user.js"
import { userAuthMissing } from "../../auth/userMiddelware.js"

/**
 * Gets the own user.
 *
 * @param req - The Express request object.
 * @param res - The Express response object.
 */
const getSelf: Handler<"get", "/users/@me"> = async (req, res) => {
	if (userAuthMissing(req)) return rejectWithError(res, notAuthenticated())

	// Get the user
	const user = await getUserWithId(req.user!.id).catch(() => {
		return null
	})

	if (!user) return rejectWithError(res, notFound(restResources.User, "No linked user for session"))

	return res.send(transformUser(user))
}

export default getSelf
