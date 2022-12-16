const cdk = require('aws-cdk-lib');
const dynamboDB = require('aws-cdk-lib/aws-dynamodb');
const lambda = require('aws-cdk-lib/aws-lambda');
const apigw = require('aws-cdk-lib/aws-apigateway');
// import { Backend } from 'aws-cdk-lib/aws-appmesh';
// const sqs = require('aws-cdk-lib/aws-sqs');

class BackendStack extends cdk.Stack {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // Creating table for storing todos in dynamoDB with partition key  of "id"
    const todoTable = new dynamboDB.Table(this, "todo", {
      tableName: "AWS-TODO-TABLE",
      partitionKey: {
        name: "id",
        type: dynamboDB.AttributeType.STRING
      }
    });

    /* Creating lambda functions Instance for al lambda functions and granting full
       full table access to all the lambda handlers */

    const getAllTodosLambda = new lambda.Function(this, "GetAllTodosLambdaHandler", {
      functionName: "getAllTodosLambda",
      runtime: lambda.Runtime.NODEJS_16_X,
      code: lambda.Code.fromAsset("lambda"),
      handler: "getAllTodos.handler",
      environment: {
        TODO_TABLE_NAME: todoTable.tableName,
      }
    });

    todoTable.grantFullAccess(getAllTodosLambda);

    const createTodoLambda = new lambda.Function(this, "createTodoLambdaHandler", {
      functionName: "createTodoLambda",
      runtime: lambda.Runtime.NODEJS_16_X,
      code: lambda.Code.fromAsset("lambda"),
      handler: "createTodo.handler",
      environment: {
        TODO_TABLE_NAME: todoTable.tableName,
      },
    });

    todoTable.grantFullAccess(createTodoLambda);

    const deleteTodoLambda = new lambda.Function(this, "deleteTodoLambdaHandler", {
      functionName: "deleteTodoLambda",
      runtime: lambda.Runtime.NODEJS_16_X,
      code: lambda.Code.fromAsset("lambda"),
      handler: "deleteTodo.handler",
      environment: {
        TODO_TABLE_NAME: todoTable.tableName,
      },
    });

    todoTable.grantFullAccess(deleteTodoLambda);

    const updateTodoLambda = new lambda.Function(this, "updateTodoLambdaHandler", {
      functionName: "updateTodoLambda",
      runtime: lambda.Runtime.NODEJS_16_X,
      code: lambda.Code.fromAsset("lambda"),
      handler: "updateTodo.handler",
      environment: {
        TODO_TABLE_NAME: todoTable.tableName,
      },
    });

    todoTable.grantFullAccess(updateTodoLambda);

    // Creating API Gateway Instance
    const api = new apigw.RestApi(this, "todoAPI");

    // Creating source path and methods for all lambda function requests 
    api.root
      .resourceForPath("todo")
      .addMethod("GET", new apigw.LambdaIntegration(getAllTodosLambda));

    api.root
      .resourceForPath("todo")
      .addMethod("POST", new apigw.LambdaIntegration(createTodoLambda));

    api.root
      .resourceForPath("todo")
      .addMethod("DELETE", new apigw.LambdaIntegration(deleteTodoLambda));

    api.root
      .resourceForPath("todo")
      .addMethod("PUT", new apigw.LambdaIntegration(updateTodoLambda));


    new cdk.CfnOutput(this, "Api URL", {
      value: api.url ?? "Something went wrong",
    });
    // example resource
    // const queue = new sqs.Queue(this, 'BackendQueue', {
    //   visibilityTimeout: Duration.seconds(300)
    // });
  }
}

module.exports = { BackendStack }