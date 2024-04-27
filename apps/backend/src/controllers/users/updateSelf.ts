import { restActions, restResources } from "openapi";
import { notAuthenticated } from "../../shared/errors/notAuthenticated.js";
import { notFound } from "../../shared/errors/notFound.js";
import { rejectWithError } from "../../shared/errors/rejectWithError.js";
import Handler from "../../zodios/requestHandler.js";
import { transformUser } from "../../transformers/user.js";
import { getUserWithId } from "../../repositories/users/getUser.js";
import { updateUser } from "../../repositories/users/updateUser.js";
import { notAuthorized } from "../../shared/errors/notAuthorized.js";
import { internalError } from "../../shared/errors/internalError.js";

/**
 * Updates the user.
 *
 * @param req - The Express request object.
 * @param res - The Express response object.
 */
const updateSelf: Handler<"put", "/users/@me"> = async (req, res) => {
    if (req.user === null) return rejectWithError(res, notAuthenticated());

    const userId = req.user.id;

    // Get the user
    const user = await getUserWithId(userId).catch(() => {
        return null;
    });

    if (!user) return rejectWithError(res, notFound(restResources.User, "User not found"));
    if (req.body.id !== userId) return rejectWithError(res, notAuthorized(restResources.User));

    // Update the user
    const updatedUser = await updateUser(req.body).catch(() => {
        return null;
    });

    if (!updatedUser) return rejectWithError(res, internalError(restActions.Update, restResources.User, "Could not update user"));

    return res.send(transformUser(updatedUser));
};

export default updateSelf;