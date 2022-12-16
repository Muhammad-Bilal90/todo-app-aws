const AWS = require('aws-sdk');
const crypto = require('crypto');
const tableName = process.env.TODO_TABLE_NAME;
const client = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    console.info("event.bodt for post: ", event.body);

    const body = JSON.parse(event.body);
    console.info("body for post: ", body);
    const name = body.name;
    const id = crypto.randomUUID();

    const params = {
        TableName: tableName,
        Item: { id: id, name: name }
    }

    console.info(params);

    try {
        const result = await client.put(params).promise();

        const response = {
            statusCode: 200,
            body: JSON.stringify(params.Item),
            headers: {
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST',
            }
        }

        return response;
    }
    catch (err) {
        console.log('DynamoDB error: ', err);
        return null;
    }
}