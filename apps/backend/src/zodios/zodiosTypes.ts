import { ApiOf } from "@zodios/core"
import { api as client } from "openapi"
import { contextSchema } from "../auth/userContext.js"

/** Generated API Interface */
export type Api = ApiOf<typeof client>

/** User Context of the API */
export type Context = typeof contextSchema
