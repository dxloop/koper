import prisma from "../prisma.js"
import { FULL_USER } from "../presets/USER.js"
import { PromiseType } from "../../shared/types.js"

/* The type of the user based on the selected properties */
export type GetUser = PromiseType<ReturnType<typeof getUserWithId | typeof getUserWithEmail>>

/**
 * Gets the user with the provided id
 * @param userId - The id of the user
 * @returns The user
 */
export async function getUserWithId(userId: string | bigint) {
	return await prisma.user.findUnique({
		select: FULL_USER,
		where: {
			id: BigInt(userId)
		}
	})
}

/**
 * Gets the user with the provided email
 * @param email - The email of the user
 * @returns The user
 */
export async function getUserWithEmail(email: string) {
	return await prisma.user.findUnique({
		select: FULL_USER,
		where: {
			email
		}
	})
}
