const AWS = require('aws-sdk');
const tableName = process.env.TODO_TABLE_NAME;
const client = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {

    var params = {
        TableName: tableName,
    }

    try {
        const data = await client.scan(params).promise();
        const items = data.Items;

        console.log(items);
        const response = {
            statusCode: 200,
            body: JSON.stringify(items),
            headers: {
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET',
            }
        }

        return response;
    } catch (err) {
        console.log('DynamoDB Error: ', err);
        return err;
    }
}