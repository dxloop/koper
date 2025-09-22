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

// Todo controllers
import getUserTodosController from "./controllers/todos/getUserTodos.js"
import createUserTodoController from "./controllers/todos/createUserTodo.js"
import getUserTodoController from "./controllers/todos/getUserTodo.js"
import updateUserTodoController from "./controllers/todos/updateUserTodo.js"
import deleteUserTodoController from "./controllers/todos/deleteUserTodo.js"

// Load the api interface from the generated file
const app = context.app(zodiosApiInterface, {
	express: express(),
	validate: true
})

app.use(userMiddleware)

// ##############################
// ### DISABLE ON PRODUCTION ####
app.use(cors()) // Temporarily allow cors
// @ts-expect-error @typescript-eslint/no-unsafe-assignment
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiSpec))
// ##############################

// User routes
app.post("/users/register", registerUser)
app.post("/users/login", authenticateUser)
app.get("/users/@me", getSelf)
app.put("/users/@me", updateSelf)
app.delete("/users/@me", deleteSelf)

// Todo routes
app.get("/users/:userId/todos", getUserTodosController)
app.post("/users/:userId/todos", createUserTodoController)
app.get("/users/:userId/todos/:id", getUserTodoController)
app.put("/users/:userId/todos/:id", updateUserTodoController)
app.delete("/users/:userId/todos/:id", deleteUserTodoController)

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
