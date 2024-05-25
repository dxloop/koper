import { UserUpdate } from "openapi"
import prisma from "../prisma.js"
import { FULL_USER } from "../presets/USER.js"
import { PromiseType } from "../../shared/types.js";

/* The type of the updated user based on the selected properties */
export type UpdateUser = PromiseType<ReturnType<typeof updateUser>>;

/**
 * Updates the user with the provided data
 * @param data - The user data
 * @returns The updated user
 */
export async function updateUser(data: UserUpdate) {
    return await prisma.user.update({
        where: { id: BigInt(data.id) },
        data: {
            email: data.email,
            name: data.name,
            password: data.password
        },
        select: FULL_USER
    })
}
