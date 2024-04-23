import { restActions, restResources } from "openapi"
import { getUserWithId } from "../../repositories/users/getUser.js";
import { notAuthenticated } from "../../shared/errors/notAuthenticated.js";
import { notFound } from "../../shared/errors/notFound.js";
import { rejectWithError } from "../../shared/errors/rejectWithError.js";
import Handler from "../../zodios/requestHandler.js"
import { transformUser } from "../../transformers/user.js";
import { deleteUser } from "../../repositories/users/deleteUser.js";
import { internalError } from "../../shared/errors/internalError.js";

/**
 * Deletes the own user.
 *
 * @param req - The Express request object.
 * @param res - The Express response object.
 */
const deleteSelf: Handler<"delete", "/users/@me"> = async (req, res) => {
    if (req.user === null) return rejectWithError(res, notAuthenticated());

    // Get the user
    const user = await getUserWithId(req.user.id).catch(() => null); 

    if(!user) return rejectWithError(res, notFound(restResources.User, "No linked user for session"));

    // Delete the user
    const deleted = await deleteUser(user.id).catch(() => null);
    if(!deleted) return rejectWithError(res, internalError(restActions.Delete, restResources.User, "Could not delete user"));

    return res.send(transformUser(user));
};

export default deleteSelf;