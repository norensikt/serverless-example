`npm install -g serverless`
`npm install`

`sls deploy`
`sls offline`
`sls invoke test`

`sls dynamodb install`
`sls offline start`
`sls dynamodb migrate`

`aws dynamodb list-tables --endpoint-url http://localhost:8000 | jq .'TableNames[]' -r | grep -v table_you_dont_want_to_delete | xargs -ITABLE -n 1 aws dynamodb delete-table --table-name TABLE --endpoint-url http://localhost:8000`

# TODO
- Add authentication to all endpoints
- Restrict client access using cors
- serverless-example-graphql-api service should be called serverless-example-order-api or something similar
- dynamodb tables names should be prefixed with service name (table names are global in aws)
- move dynamodb table configuration to separate file
- fix so notes can be empty (passing empty notes now causes api to fail)
- cleanup test data after tests and improve test setup (currently you need to start dynamodb locally and run migrations for tests to pass, test data is not cleant up after either)
- Add better documentation, both in README and in code
- Use a linter to make sure code is up to common standards
