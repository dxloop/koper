import prisma from "../prisma.js"

/**
 * Deletes the user with the provided id
 * @param userId - The id of the user
 * @returns The deleted user
 */
export async function deleteUserWithId(userId: string | bigint) {
	return await prisma.user.delete({
		where: {
			id: BigInt(userId)
		}
	})
}
