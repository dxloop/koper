import { BaseUser, User } from "openapi";


/**
 * The properties to select for the base user
 */
export const BASE_USER = {
    email: true,
    name: true,
} as Record<keyof BaseUser, boolean>;

/**
 * The type of the base user based on the selected properties
 */
export type BASE_USER_TYPE = Pick<BaseUser, keyof typeof BASE_USER>;

/**
 * The properties to select for the full user
 */
export const USER = {
    ...BASE_USER,
    id: true,
} as Record<keyof User, boolean>;

/**
 * The type of the full user based on the selected properties
 */
export type USER_TYPE = Pick<User, keyof typeof USER>;


/**
 * The properties to select for the full user
 */
export const FULL_USER = {
    ...USER,
    password: true,
} as Record<keyof User | "password", boolean>;


/**
 * The type of the full user based on the selected properties
 */
export type FULL_USER_TYPE = Pick<User & { password: string }, keyof typeof FULL_USER>;