# Catalog Api Challenge

To run the backend you must use:

`docker compose up -d` or `npm run start`

Next go to [Api doc](http://localhost:3000/api/swagger) in http://localhost:3000/api/swagger for the api definitions and explication

This project provide an API for manage a catalog and users' favorites. It offers the following features:

- List catalog
- Add favorite contents to a user
- Remove favorite contents from a user
- List favorite contents of a user
- List the most favorited contents

## Test command

`docker compose -f docker-compose-test.yml run backend_test`

or

`npm run test:docker`

## Serverless

You can also deploy the application with Serverless or Serverless Offline. It requires running an instance of Postgres and executing the command next to run it locally.

`npm run dev:sls`
