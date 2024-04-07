import { restErrorCodes } from "openapi"
import { hash } from "bcrypt"
import { PEPPER, SALT_ROUNDS } from "../../config/config.js"
import Handler from "../../zodios/requestHandler.js"
import { createUser } from "../../repositories/users/createUser.js"
import { generateToken } from "../../auth/jwt.js"

/**
 * Register a new user.
 *
 * @param req - The Express request object.
 * @param res - The Express response object.
 */
const registerUser: Handler<"post", "/users/register"> = async (req, res) => {
    // Check if user with email already exists

    // Hash Password
    const hashedPassword = await hash(req.body.password + PEPPER, SALT_ROUNDS).catch(() => {
        return null;
    });

    if (hashedPassword === null) {
        return res.status(501).send({
            status: 501,
            message: "Could not hash password",
            code: restErrorCodes.INTERNAL_SERVER_ERROR
        });
    }

    // Create User
    const createdUser = await createUser(req.body).catch(() => null);
    if (createdUser === null) {
        return res.status(501).send({
            status: 501,
            message: "Could not create user",
            code: restErrorCodes.INTERNAL_SERVER_ERROR
        });
    }

    // Generate JWT Token
    const accessToken = await generateToken({ id: createdUser.id.toString() }).catch(() => null);
    if (accessToken === null) {
        return res.status(501).send({
            status: 501,
            message: "Could not generate access token",
            code: restErrorCodes.INTERNAL_SERVER_ERROR
        });
    }

    return res.status(201).send({
        id: createdUser.id.toString(),
        name: createdUser.name || "",
        email: createdUser.email,
        token: accessToken,
        tokenType: "Bearer"
    });
}

export default registerUser