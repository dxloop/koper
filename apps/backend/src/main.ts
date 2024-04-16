import express from "express"
import cors from "cors"
import swaggerUi from "swagger-ui-express"

import { PORT } from "./config/config.js"

// Generated Zodios API
import { zodiosApiInterface, openapiSpec } from "openapi"
import context from "./auth/userContext.js"
import userMiddleware from "./auth/userMiddelware.js"
import registerUser from "./controllers/users/registerUser.js"

// Load the api interface from the generated file
const app = context.app(zodiosApiInterface, {
	express: express(),
	validate: true
})

// ##############################
// ### DISABLE ON PRODUCTION ####
app.use(cors()) // Temporarily allow cors
// @ts-expect-error @typescript-eslint/no-unsafe-assignment
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiSpec))
// ##############################

app.use(userMiddleware)

// Temporarily register controllers
app.post("/users/register", registerUser)

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
