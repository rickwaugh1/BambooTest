module.exports =
{
	DynamoLevelSchema: function(tableExtension)
	{
		var dynamoLevelSchema =
		{
			"TableName":'dynamo_schema_level_' + tableExtension,
			"Item":
			{
				"level": ""
			}
		}

		return dynamoLevelSchema;
	},
	DynamoTestSchema: function(tableExtension)
	{
		var dynamoTestSchema =
		{
			"TableName":'dynamo_test_' + tableExtension,
			"Item":
			{
				"typex": ""
			}
		}

		return dynamoTestSchema;
	},
	DynamoLevel1Schema: function(tableExtension)
	{
		var dynamoLevel1Schema =
		{
			"TableName":'dynamo_schema_level_1_' + tableExtension,
			"Item":
			{
				"level": ""
			}
		}

		return dynamoLevel1Schema;
	},
	DynamoTest1Schema: function(tableExtension)
	{
		var dynamoTest1Schema =
		{
			"TableName":'dynamo_test_1_' + tableExtension,
			"Item":
			{
				"typex": ""
			}
		}

		return dynamoTest1Schema;
	}
}