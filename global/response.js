/**
 * @api {GET} None List of ESP Response Codes
 * @apiName Response Codes
 * @apiGroup Response Codes
 *
 * @apiError OK										[ 200, 1000 ]
 *
 * @apiError GENERIC_ERROR 							[ 500, 2000 ]
 * @apiError UNEXPECTED_DATABASE_ERROR 				[ 500, 3000 ]
 *
 * @apiError PARAMETER_NOT_SPECIFIED				[ 400, 2100 ]
 * @apiError PARAMETER_INVALID						[ 400, 2101 ]
 * @apiError INVALID_MONGO_OBJECT_ID				[ 400, 2106 ]
 *
 * @apiError CONTENT_NOT_FOUND						[ 404, 3001 ]
 * @apiError USER_NOT_FOUND							[ 404, 3010 ]
 * @apiError EMAIL_ALREADY_EXISTS					[ 409, 3011 ]
 * @apiError USER_NAME_ALREADY_EXISTS				[ 409, 3012 ]
 * @apiError USER_ACCOUNT_BANNED					[ 409, 3014 ]
 *
 * @apiError NOT_LOGGED_IN							[ 401, 4001 ]
 * @apiError ACCESS_DENIED							[ 403, 4002 ]
 * @apiError OUT_OF_SYNC							[ 409, 4003 ]
 * @apiError VERSION_MISMATCH						[ 409, 4004 ]
 * @apiError TEMPORARY_PASSWORD_EXPIRED				[ 403, 4005 ]
 * @apiError NOT_CONNECTED_TO_GAME					[ 403, 4020 ]
 * @apiError GAME_ENDING							[ 403, 4021 ]
 * @apiError GAME_OVER								[ 403, 4022 ]
 **/

/* REMEMBER TO ADD ANY NEW CODES TO THE LIST ABOVE, SO IT SHOWS UP IN THE API DOCUMENTATION!!!! */
GLOBAL.Responses =
{
	"OK":									[ 200, 1000 ],

	"GENERIC_ERROR": 						[ 500, 2000 ],
	"UNEXPECTED_DATABASE_ERROR": 			[ 500, 3000 ],

	"PARAMETER_NOT_SPECIFIED":				[ 400, 2100, "warn" ],
	"PARAMETER_INVALID":					[ 400, 2101, "warn" ],
	"INVALID_MONGO_OBJECT_ID":              [ 400, 2106, "warn" ],

	"CONTENT_NOT_FOUND":		     		[ 404, 3001, "warn" ],
	"USER_NOT_FOUND":  					    [ 404, 3010, "warn" ],
	"EMAIL_ALREADY_EXISTS":					[ 409, 3011, "warn" ],
	"USER_NAME_ALREADY_EXISTS":				[ 409, 3012, "warn" ],
	"USER_ACCOUNT_BANNED":					[ 409, 3014, "warn" ],

	"NOT_LOGGED_IN":						[ 401, 4001 ],
	"ACCESS_DENIED":						[ 403, 4002 ],
	"OUT_OF_SYNC":							[ 409, 4003, "info" ],
	"VERSION_MISMATCH":						[ 409, 4004, "warn" ],
	"TEMPORARY_PASSWORD_EXPIRED":			[ 403, 4005, "info" ],
	"NOT_CONNECTED_TO_GAME":				[ 403, 4020 ],
	"GAME_ENDING":							[ 403, 4021, "info" ],
	"GAME_OVER":							[ 403, 4022, "warn" ],
	"NOT_SCORING":							[ 403, 4023, "info" ],
};



GLOBAL.respond_to_HTTP_request =
function respond_to_HTTP_request(response, err, data)
{
	var error_key = get_error_key(err);
	var HTTP_code = Responses[error_key][0];

	var headers = {"Content-Type": "application/json"};

	var payload = format_payload(err, error_key, data);
	var payload_JSON = JSON.stringify(payload);

	response.writeHead(HTTP_code, headers);
	response.end(payload_JSON);

	if (err) log_error(err, Responses[error_key][2]);
}



GLOBAL._E = function _E(error_key, extra_data)
{
	var new_error;

	for (var key in Responses)
	{
		if (key === error_key)
		{
			new_error = new Error(key);
			break;
		}
	}

	if (!new_error)
	{
		new_error = new Error("GENERIC_ERROR");
	}

	if (extra_data)
	{
		new_error["extra_data"] = extra_data;
	}

	return new_error;
}



function format_payload(err, error_key, data)
{
	var payload =
	{
		"status": error_key,
		"code": Responses[error_key][1],
		"data": data,
	};

	if (err && err["extra_data"])
	{
		payload["extra_data"] = err["extra_data"];
	}

	return payload;
}



function get_error_key(err)
{
	var error_key;

	if (err)
	{
		if (typeof err === "object")
		{
			if (err["name"] === "CastError" && err["type"] === "ObjectId")
			{
				error_key = "INVALID_MONGO_OBJECT_ID";
			}
			else
			{
				error_key = err["message"];
			}
		}
		else if (typeof err === "string")
		{
			error_key = err;
		}

		if (!_.has(Responses, error_key))
		{
			error_key = "GENERIC_ERROR";
		}
	}
	else
	{
		error_key = "OK";
	}

	return error_key;
}


// Used in management console to make sure user is authorized.
GLOBAL.check_admin_credentials =
function check_admin_credentials(privilege,request,response)
{
	if (!_.contains(request.session.admin_me["privileges"],privilege))
	{
		var data = {};
		data.title = "Focal Admin Login";
		data.error_message = "ACCESS_DENIED";
		data["no_show"] = [];

		response.render("admin_login",data);

		return false;
	}

	else return true;
}
