/*
   DynamoDB level checker. The intent is to run this script, and depending on the level kept in
   the dynamo_schema_level table, apply scripts/database changes automatically, to bring the database
   up to the current level.

   it uses a json file kept in the build directory, dynamo_levels.json. This has a structure for each level.
   starting with 0. There are two parts to the json file at each level. First is tableParams, which are the parameter files
   required to build tables. Second is dataScripts, which contains function names, one for each level, stored at the bottom of
   this script file. Each function must contain everything it needs to run updates to the database, (including creating/dropping indexes,
   or data changes.) The structures must exist for each level stored in the database, and there must be one structure for each level.
   First thing the script does, if the tables don't exist at all, is build the tables.
*/

var regionName = process.argv[2];
var tableExtension = process.argv[3];

var AWS = require('aws-sdk');
AWS.config.update({region: regionName});
var Dynamodb = new AWS.DynamoDB();
var Doc = require("dynamodb-doc");
var DocClient = new Doc.DynamoDB(Dynamodb);
var schema = require("../config/schema.js");
var dynamoLevels = require("./dynamo_levels.json");
var Async = require("async");

inspect = require('eyes').inspector({maxLength:75000});

console.log("number of levels is " + dynamoLevels.length)

if (dynamoLevels.length == 0)
{
	throw new Error("No definitions for tables or changes found in dynamo_levels.json");
}

else
{
	retrieveDynamoLevels(dynamoLevels,function(err,data)
	{
		if (err) console.log(err);
		else console.log("Dynamo check/build completed successfully");
	});
}

function retrieveDynamoLevels(dynamoLevels,next)
{
	Async.eachSeries(dynamoLevels,function iterator(level,callback)
	{
		var tableParams = level["tableParams"];
		var dataScript = level["dataScripts"];
		console.log("we are at level " + level["level"])

		var levelLookupParams =
		{
			TableName : "dynamo_schema_level_" + tableExtension,
			Key:
			{
				"level" :  level["level"]
			}
		}

		DocClient.getItem(levelLookupParams, function(err, data)
		{
			var runData = true;
			inspect(data);

			if (err && err["code"] != "ResourceNotFoundException")
			{
				// We actually have an error.
				throw (err);
				runData = false;
			}

			else if (err && err["code"] == "ResourceNotFoundException")
			{
				// Don't even have the first table, the levels table
				runData = true;
			}

			else if (data && data["Item"] && data["Item"]["level"] == level["level"])
			{
				// This level has already been run on this database
				runData = false;
				console.log("level " +  level["level"] + " has already been run");
				callback(null);
			}

			if (runData)
			{
				if (tableParams.length > 0)
				{
					console.log("found table params " + tableParams.length)
					// We need to build some tables

					Async.eachSeries(tableParams, function iterator(params,callback)
					{
						console.log("creating table")

						params["TableName"] = params["TableName"] + "_" + tableExtension;

						Dynamodb.createTable(params,function(err,data)
						{
							if (err)
							{
								console.log(err);
								callback(err);
							}

							else
							{
								console.log(data)
								checkTableStatus(params["TableName"], 0, function(check_err,data)
								{
									// Need to wait for it to be ready.
									callback(check_err);
								});
							}
						});
					},
					function done(err, result)
					{
						if (err) throw(err);

						if (dataScript)
						{
							runScripts(dataScript,function(err)
							{
								callback(err);
							});
						}
					});
				}
				else if (dataScript)
				{
					runScripts(dataScript,function(err)
					{
						callback(err);
					});
				}
			}
		});
	},
	function done(err, result)
	{
		next(err);
	});
}

/* run by the main function above, and acts on the string passed from dynamo_levels.json */
function runScripts(dataScript,next)
{
	eval(dataScript)
	eval(dataScript + '(function(err){next(err)})');
}

function createTable(params,next)
{
	console.log("creating table")
	console.log([params])
	params["TableName"] = params["TableName"] + "_" + tableExtension;

	Dynamodb.createTable(params,function(err,data)
	{
		if (err)
		{
			console.log(err);
			next(err);
		}

		else
		{
			console.log(data)
			checkTableStatus(params["TableName"], 0, function(check_err,data)
			{
				// Need to wait for it to be ready.
				next(check_err);
			});
		}
	});
}

/* see if a table is ready for use. It will keep checking until the status is ACTIVE */
function checkTableStatus(tableName, currentTimeout, next)
{
	var checkTableStatusParams =
	{
	    TableName: tableName
	};
	Dynamodb.describeTable(checkTableStatusParams,function(err,data)
	{
		if (err)
		{
			throw new Error(err.message);
		}
		else
		{
			var tableStatus = data["Table"]["TableStatus"];

			if (tableStatus != "ACTIVE" && currentTimeout >= 60000)
			{
				var err = new Error("Checking for table status " + tableName + " timed out");
				next(err);
			}
			else if (tableStatus == "ACTIVE")
			{
				console.log("Active Status for table " + tableName + " found after " + currentTimeout + " seconds");
				next(null);
			}
			else
			{
				setTimeout(function()
				{
					console.log("Status is " + tableStatus + " after " + currentTimeout + " seconds");
					currentTimeout++;
					checkTableStatus(tableName, currentTimeout, next);
				}, 1000);
			}
		}
	});
}

/*
	The following functions are called as part of the build/check process. They are listed in the
	dynamo_levels.json file, and are associated with a particular level.
*/
function BuildSchemaLevel(next)
{
	Async.series(
	[
		function(callback)
		{
			var dynamoLevelSchemaItem = schema.DynamoLevelSchema(tableExtension);
			console.log(dynamoLevelSchemaItem);
			dynamoLevelSchemaItem.Item.level = 0;

			checkTableStatus('dynamo_schema_level_' + tableExtension, 0, function()
			{
				DocClient.putItem(dynamoLevelSchemaItem,function(err, data)
				{
					if (err)
					{
						callback(err);
					}
					else
					{
						callback(null);
					}
				});
			});
		},
		function(callback)
		{
			var dynamoTestSchemaItem = schema.DynamoTestSchema(tableExtension);
			console.log(dynamoTestSchemaItem);
			dynamoTestSchemaItem.Item.typex = '6';

			checkTableStatus('dynamo_test_' + tableExtension, 0, function()
			{
				DocClient.putItem(dynamoTestSchemaItem,function(err, data)
				{
					if (err)
					{
						callback(err);
					}
					else
					{
						callback(null);
					}
				});
			});
		}
	],
	// optional callback
	function(err, results)
	{
	    next(err);
	});
}

function BuildSchemaLevel1(next)
{
	Async.series(
	[
		function(callback)
		{
			var dynamoLevel1SchemaItem = schema.DynamoLevel1Schema(tableExtension);
			console.log(dynamoLevel1SchemaItem);
			dynamoLevel1SchemaItem.Item.level = 1;

			checkTableStatus('dynamo_schema_level_1_' + tableExtension, 0, function()
			{
				DocClient.putItem(dynamoLevel1SchemaItem,function(err, data)
				{
					if (err)
					{
						callback(err);
					}
					else
					{
						callback(null);
					}
				});
			});
		},
		function(callback)
		{
			var dynamoTest1SchemaItem = schema.DynamoTest1Schema(tableExtension);
			console.log(dynamoTest1SchemaItem);
			dynamoTest1SchemaItem.Item.typex = '22';

			checkTableStatus('dynamo_test_1_' + tableExtension, 0, function()
			{
				DocClient.putItem(dynamoTest1SchemaItem,function(err, data)
				{
					if (err)
					{
						callback(err);
					}
					else
					{
						callback(null);
					}
				});
			});
		}
	],
	// optional callback
	function(err, results)
	{
	    next(err);
	});
}