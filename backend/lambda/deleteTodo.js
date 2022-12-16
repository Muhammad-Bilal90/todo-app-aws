const AWS = require('aws-sdk');
const tableName = process.env.TODO_TABLE_NAME;
const client = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    console.info("event.body for post: ", event);

    const id = event.queryStringParameters.id;
    console.info("id: ", id);

    const params = {
        TableName: tableName,
        Key: { id: id }
    }

    console.info("params: ", params);

    try {
        const result = await client.delete(params).promise();
        console.log(result);
        const response = {
            statusCode: 200,
            body: JSON.stringify(id),
            headers: {
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'DELETE',
            }
        }

        return response;
    }
    catch (err) {
        console.log('DynamoDB error: ', err);
        return null;
    }
}