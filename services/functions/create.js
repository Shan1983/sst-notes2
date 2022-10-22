import * as uuid from "uuid";
import handler from "../utils/handler";
import dynamoDb from "../utils/dynamodb";

export const main = handler(async (event) => {
  const data = JSON.parse(event.body);

  const params = {
    TableName: process.env.TABLE_NAME,
    Item: {
      userId: "123",
      noteId: uuid.v1(),
      content: data.content,
      attachment: data.attachment,
      createdAt: Date.now(),
    },
  };

  await dynamoDb.put(params).promise();

  return params.Item;
});
