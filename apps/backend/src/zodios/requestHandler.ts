import { Method, ZodiosPathsByMethod } from "@zodios/core"
import { ZodiosRequestHandler } from "@zodios/express"
import { Api, Context } from "./zodiosTypes.js"

/**
 * Handler that extracts the types of the request and response from the Zodios API definition.
 */
type Handler<M extends Method, Path extends ZodiosPathsByMethod<Api, M>> = ZodiosRequestHandler<Api, Context, M, Path>

export default Handler
