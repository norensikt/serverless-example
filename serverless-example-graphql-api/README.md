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
- Setup auth handler
- Restrict client access using cors
- service should be called order service
    - possible to move customer to separate service depending on extensions to system
- dynamodb tables names should be prefixed with service name
- this library provides some good abstractions for dynamodb https://www.npmjs.com/package/dynamodb-doc-client-wrapper
- move dynamodb table configuration to separate file
- move graphql related code and schema to separate files
- fix so notes can be empty
- cleanup test data after tests
