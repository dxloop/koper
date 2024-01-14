
# KOPER - Contract-First Techstack
**KOPER** is a modern tech stack designed for creating Full-Stack Applications with the Contract-First Approach, leveraging the power of Kubb, OpenAPI, Prisma, Express.js, and React. This stack streamlines the development process by utilizing the OpenAPI file as the single source of truth, enabling the automatic generation of various resources and reducing manual labor. By using this approach you can focus on the business logic.

> [!WARNING]
> Frontend and Medium Article are still in progress.

If you are interested in a deep-dive of the usage possibilities check-out following [article]().

![](/.docs/images/KOPER.png)

## Tech Stack Overview

- **Kubb**: A generator for OpenAPI that produces TypeScript, React-Query, Zod, Zodios, Faker.js, MSW, and Axios code.

- **OpenAPI**: The OpenAPI Specification provides a formal standard for describing HTTP APIs, serving as the foundation for the entire development process.

- **Prisma**: A next-generation Node.js and TypeScript ORM, providing a powerful and type-safe database access layer.

- **Express.js**: A fast, unopinionated, minimalist web framework for Node.js, facilitating the creation of robust and scalable server-side applications.

- **React**: A JavaScript library for building user interfaces, offering a dynamic and efficient way to create engaging web applications.

## Contract-First Development

**KOPER embraces Contract-First Development principles**, utilizing the OpenAPI file as the single source of truth.
This approach significantly simplifies development by automatically generating various resources, **reducing the need for manual work** and providing more time to focus on business logic.

You will need a basic understanding of the OpenAPI Specification to use KOPER. If you are unfamiliar with OpenAPI, please refer to the [OpenAPI Specification](https://swagger.io/specification/) and [OpenAPI Tutorial](https://swagger.io/resources/open-api/) for more information.

The OpenAPI is a formal standard for describing HTTP APIs, providing a structured way to define endpoints, parameters, responses, and more. KOPER uses the OpenAPI file to generate resources for both the frontend and backend, including types, validation objects, client functions, and more.

## Switchable Components
KOPER allows for flexibility by enabling the replacement of following components:

- **Frontend (React)**: Can be swapped with other frontend frameworks.
- **Database ORM (Prisma)**: Can be replaced with alternatives like Drizzle, Mongoose, or others.
- **Web Framework (Express.js)**: Can be substituted with other web frameworks, although this may result in the loss of certain features such as the API interface and automatic validation.

**The most important component is Kubb and OpenAPI**, which are the foundation of the entire stack. The other components can be replaced with alternatives and new components can be added as needed.

## OpenAPI -> Kubb

### The OpenAPI file serves as the input for Kubb, generating the following resources:

- `/packages/openapi/src/generated/swagger-ts`: Types for REST resources with JSDoc comments, usable in both frontend and backend.
- `/packages/openapi/src/generated/swagger-client`: Client functions for making API requests via Axios (replaceable with other frameworks).
- `/packages/openapi/src/generated/zod`: Validation objects constructed from the specified constraints for client and server-side validation.
- `/packages/openapi/src/generated/tanstack-query`: Queries for React, Vue, etc., handling caching, deduplication, and state logic for HTTP requests.
- `/packages/openapi/src/generated/faker`: Functions to generate randomized resource objects for testing.

## Features

### Frontend

1. **[Tanstack-Query for Effortless Query Management](https://tanstack.com/query/latest)**:
Simplify frontend query management with Tanstack-Query, minimizing manual work and offering features like caching, deduplication, and mutations.
   
2. **[Form Input Validation with Zod Objects](https://zod.dev/)**:
Validate user inputs seamlessly using Zod objects before initiating requests, ensuring data integrity and adherence to specified constraints.

3. **[Fake Data Integration for Frontend Display](https://fakerjs.dev/)**:
Leverage Faker.js data to dynamically display mock content in frontend components, aiding in the development process and enabling realistic testing scenarios.

4. **[Typed Application for Enhanced Stability](https://www.typescriptlang.org/)**:
Ensure a robust and stable application with diverse types for resources during creation or update operations. Reduce type-related issues and eliminate manual labour for creating the different types.

### Backend

1. **[Typed API Interface via Zodios](https://www.zodios.org/docs/server/express-app)**:
Enhance Express applications with a typed API interface provided by Zodios. Receive typing suggestions, enabling early detection of type errors and increasing code reliability.

2. **Automatic Validation of Incoming Requests through Zodios**:
Automate the validation process for incoming requests using Zodios. Utilize Zod objects generated by Kubb to validate request bodies and query parameters against OpenAPI specifications, eliminating the need for manual validation.

3. **[Flexible Handling of Fake Data](https://fakerjs.dev/)**:
Seamlessly integrate Faker.js functions to either return mock data or insert fake data into the database. Facilitate frontend development by providing temporary resources and enable comprehensive testing in the backend.

By embracing these features, KOPER ensures a development environment that not only simplifies processes but also enhances the overall stability and reliability of both frontend and backend components. Developers can focus on crafting robust business logic while the stack takes care of the intricate details like validation, type-safety, state-management and et.

## Template
The KOPER template is a monorepo (Turborepo) that contains the following packages:
- **apps**: Contains the frontend, backend and other applications.
    - **frontend**: Contains the frontend application.
    - **backend**: Contains the backend application.
- **packages**: Contains the shared packages, including the configs, database-related packages, and the OpenAPI package.
    - **eslint-config**: Contains the ESLint configuration.
    - **openapi**: Contains the OpenAPI file and the generated resources.
    - **database**: Contains the Prisma schema and the generated prisma client.

The boiler-plate code in the template is kept pretty simple and is primarily intended to demonstrate the usage of the generated resources. If you plan to use KOPER in a real project, replace the boiler-plate code (auth,components) with your own business logic.
Furthermore the OpenAPI specification is also a minimal example and stripped down to the bare minimum.

### Start Application
#### 1. Install Dependencies
```bash
npm install
```
#### 2. Push Database Schema
```bash
cd ./packages/database
npm run push
```
#### 3. Start Application
Go to the root directory and start the application, which will build the monorepo and start the frontend and backend.
```
cd ./ # root directory
npm run dev 
```

## Feedback, Issues, and Contributions
If you have any feedback, issues, or contributions, please feel free to open an issue or pull request.