const AWS = require('aws-sdk');
const tableName = process.env.TODO_TABLE_NAME;
const client = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    console.info("event.body for post: ", event);

    const id = event.queryStringParameters.id;
    const body = JSON.parse(event.body);
    const name = body.name;
    console.info("body for post: ", body);
    console.info("id: ", id);

    const params = {
        TableName: tableName,
        Key: { id: id },
        UpdateExpression: "set #name = :newname",
        ExpressionAttributeNames: {
            "#name": "name"
        },
        ExpressionAttributeValues: {
            ":newname": name
        }
    }

    console.info("params: ", params);

    try {
        const result = await client.update(params).promise();
        console.log(result);
        const response = {
            statusCode: 200,
            body: JSON.stringify({ id: id, name: name }),
            headers: {
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'PUT',
            }
        }

        return response;
    }
    catch (err) {
        console.log('DynamoDB error: ', err);
        return null;
    }
}