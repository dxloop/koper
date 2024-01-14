import { UserRegistration } from "openapi";
import prisma from "../prisma.js";

/**
 * Creates the new user with the provided data
 * @param data - The user data
 * @returns The created user
 */
export async function createUser(data: UserRegistration) {
    return await prisma.user.create({
        data: {
            email: data.email,
            password: data.password,
            name: data.name
        },
        select: {
            id: true,
            email: true,
            name: true,
            password: true
        }
    })
}