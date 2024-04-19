import { USER_TYPE } from "../repositories/presets/USER.js";
import { CreateUser } from "../repositories/users/createUser.js";
import { GetUser } from "../repositories/users/getUser.js";

/**
 * Returns the api user object based on the provided data from the database
 * @param data - The user data
 * @returns The api user object
 */
export function transformUser(data: CreateUser | GetUser): USER_TYPE {
    if (data === null) throw new Error("Failed to transform user data")
    return {
        id: data!.id.toString(),
        email: data.email,
        name: data.name || ""
    }
}