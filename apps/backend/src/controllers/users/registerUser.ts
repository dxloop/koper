import { restActions, restResources } from "openapi"
import { hash } from "bcrypt"
import { PEPPER, SALT_ROUNDS } from "../../config/config.js"
import Handler from "../../zodios/requestHandler.js"
import { createUser } from "../../repositories/users/createUser.js"
import { generateToken } from "../../auth/jwt.js"
import { rejectWithError } from "../../shared/errors/rejectWithError.js"
import { internalError } from "../../shared/errors/internalError.js"
import { transformUser } from "../../transformers/user.js"
import { getUserWithEmail } from "../../repositories/users/getUser.js"
import { alreadyExists } from "../../shared/errors/alreadyExists.js"

/**
 * Register a new user.
 *
 * @param req - The Express request object.
 * @param res - The Express response object.
 */
const registerUser: Handler<"post", "/users/register"> = async (req, res) => {
	// Check if user with email already exists
	const userExists = await getUserWithEmail(req.body.email).catch(() => null)
	if (userExists) {
		return rejectWithError(res, alreadyExists(restResources.User))
	}

	// Hash Password
	const hashedPassword = await hash(req.body.password + PEPPER, SALT_ROUNDS).catch(() => {
		return null
	})

	if (hashedPassword === null) {
		return rejectWithError(res, internalError(restActions.Create, restResources.User, "Could not hash password"))
	}

	// Create User
	const createdUser = await createUser({ ...req.body, password: hashedPassword }).catch(() => null)
	if (createdUser === null) {
		return rejectWithError(res, internalError(restActions.Create, restResources.User, "Could not create user"))
	}

	// Generate JWT Token
	const accessToken = await generateToken({ id: createdUser.id.toString() }).catch(() => null)
	if (accessToken === null) {
		return rejectWithError(res, internalError(restActions.Create, restResources.User, "Could not generate token"))
	}

	return res.status(201).send({
		...transformUser(createdUser),
		token: accessToken,
		tokenType: "Bearer"
	})
}

export default registerUser
