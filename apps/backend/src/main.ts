import express from "express"
import cors from "cors"
import swaggerUi from "swagger-ui-express"

import { PORT } from "./config/config.js"

// Generated Zodios API
import { zodiosApiInterface, openapiSpec } from "openapi"
import context from "./auth/userContext.js"
import userMiddleware from "./auth/userMiddelware.js"
import registerUser from "./controllers/users/registerUser.js"
import getSelf from "./controllers/users/getSelf.js"
import updateSelf from "./controllers/users/updateSelf.js"
import deleteSelf from "./controllers/users/deleteSelf.js"
import authenticateUser from "./controllers/users/authenticateUser.js"

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
app.post("/users/login", authenticateUser)
app.get("/users/@me", getSelf)
app.put("/users/@me", updateSelf)
app.delete("/users/@me", deleteSelf)


app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
