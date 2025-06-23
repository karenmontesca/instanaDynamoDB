
/*const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");

const client = new DynamoDBClient({});

exports.handler = async (event) => {
  const params = {
    TableName: "UsuariosPOC",
    Item: {
      userId: { S: "user-" + Date.now() },
      timestamp: { S: new Date().toISOString() }
    },
  };

  try {
    await client.send(new PutItemCommand(params));
    console.log("Dato insertado con éxito.");
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Dato guardado correctamente." }),
    };
  } catch (err) {
    console.error("Error al insertar:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error al guardar." }),
    };
  }
};
*/

const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");

const client = new DynamoDBClient({});

exports.handler = async (event) => {
  console.log("Evento recibido:", JSON.stringify(event, null, 2));

  const params = {
    TableName: "UsuariosPOC",
    Item: {
      userId: { S: "user-" + Date.now() },
      timestamp: { S: new Date().toISOString() }
    },
  };

  try {
    await client.send(new PutItemCommand(params));
    console.log("Dato insertado con éxito.");
    return {
      statusCode: 200,
      headers: {            // <---- Obligatorio para API Gateway v2
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: "Dato guardado correctamente." }),
    };
  } catch (err) {
    console.error("Error al insertar:", err);
    return {
      statusCode: 500,
      headers: {            // <---- También aquí
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: "Error al guardar.", error: err.message }),
    };
  }
};

