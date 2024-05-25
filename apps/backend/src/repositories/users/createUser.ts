import { UserRegistration } from "openapi"
import prisma from "../prisma.js"
import { FULL_USER } from "../presets/USER.js"
import { PromiseType } from "../../shared/types.js"

/* The type of the created user based on the selected properties */
export type CreateUser = PromiseType<ReturnType<typeof createUser>>

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
		select: FULL_USER
	})
}
