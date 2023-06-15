# Catalog Api Challenge

To run the backend you must use:

`docker compose up -d` or `npm run start:docker`

Next go to [Api doc](http://localhost:3000/api/swagger) in http://localhost:3000/api/swagger for the api definitions and explication

Note that the docker image is being used in develop mode, if we were to deploy the api to production we should use the compiled JavaScript files

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

## Refactor branch

In the 'refactor' branch, which was dedicated to code improvements and removing some libraries,
the moment library was removed for handling dates, and it was replaced with native JavaScript methods.
