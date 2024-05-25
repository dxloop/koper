import { restActions, restResources } from "openapi";
import { notAuthenticated } from "../../shared/errors/notAuthenticated.js";
import { notFound } from "../../shared/errors/notFound.js";
import { rejectWithError } from "../../shared/errors/rejectWithError.js";
import Handler from "../../zodios/requestHandler.js";
import { transformUser } from "../../transformers/user.js";
import { getUserWithEmail, getUserWithId } from "../../repositories/users/getUser.js";
import { updateUser } from "../../repositories/users/updateUser.js";
import { notAuthorized } from "../../shared/errors/notAuthorized.js";
import { internalError } from "../../shared/errors/internalError.js";
import { hash } from "bcrypt";
import { PEPPER, SALT_ROUNDS } from "../../config/config.js";
import { alreadyExists } from "../../shared/errors/alreadyExists.js";
import { userAuthMissing } from "../../auth/userMiddelware.js";

/**
 * Updates the user.
 *
 * @param req - The Express request object.
 * @param res - The Express response object.
 */
const updateSelf: Handler<"put", "/users/@me"> = async (req, res) => {
    if (userAuthMissing(req)) return rejectWithError(res, notAuthenticated());

    const userId = req.user!.id;

    // Check if email is available
    const emailExists = await getUserWithEmail(req.body.email).catch(() => null);
    if (emailExists && emailExists.id !== userId) return rejectWithError(res, alreadyExists(restResources.User));

    // Get the user
    const user = await getUserWithId(userId).catch(() => {
        return null;
    });

    if(!user) return rejectWithError(res, notFound(restResources.User, "No linked user for session"));
    if (req.body.id !== userId.toString()) return rejectWithError(res, notAuthorized(restResources.User));

    // Hash Password
	const hashedPassword = await hash(req.body.password + PEPPER, SALT_ROUNDS).catch(() => {
		return null
	})

	if (hashedPassword === null) {
		return rejectWithError(res, internalError(restActions.Create, restResources.User, "Could not hash password"))
	}

    // Update the user
    const updatedUser = await updateUser({...req.body, password: hashedPassword}).catch(() => {
        return null;
    });

    if (!updatedUser) return rejectWithError(res, internalError(restActions.Update, restResources.User, "Could not update user"));

    return res.send(transformUser(updatedUser));
};

export default updateSelf;