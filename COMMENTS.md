## Catalog Api Challenge

I used Express, TypeScript, Prisma, Postgres, and Docker to build the API. Express is a fast and minimalist web framework for Node.js, TypeScript provides static type checking and enhanced tooling, Prisma simplifies database access and management, Postgres is a powerful and reliable database system, and Docker allows for containerization and easy deployment. Together, these technologies create a robust and scalable API with type safety, efficient database management, and streamlined development and deployment processes.

### Libraries

For prod:

- @prisma/client
- express
- moment
- serverless-http

For dev:

- eslint
- jest
- prettier
- prisma
- serverless-offline
- supertest
- swagger-autogen
- ts-jest
- ts-node
- ts-node-dev,
- typescript

If I have more time, I would improve the API by introduce authentication with api-key for example, also would use encryption to store the userId, increasing test coverage a bit more, optimizing performance, and implementing logging and monitoring functionalities. Also like to improve the deployment process by implementing better integration with AWS, enabling automatic deployment whenever changes are pushed to the main branch and use DynamoDB if we were to migrate the project to Lambda functions.

I didn't implement the additional requirement of using encryption to store userId because I focused most of the allotted time on creating a high-quality API with thorough testing.
