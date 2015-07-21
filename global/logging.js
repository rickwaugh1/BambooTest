
GLOBAL.log_error =
function log_error(error, level)
{
	var error_data = {};

	if (typeof error === "object")
	{
		if (error.message)
		{
			error_data["message"] = error.message;
		}
		if (error.extra_data)
		{
			error_data["extra_data"] = error.extra_data;
		}
		if (error.code)
		{
			error_data["code"] = error.code;
		}
		if (error.type)
		{
			error_data["type"] = error.type;
		}
		if (error.stack)
		{
			error_data["stack"] = error.stack;
		}
		if (!error.message)
		{
			error_data["error"] = error;
		}
	}
	else
	{
		error_data["error"] = error;
	}

	if (!level)
	{
		level = "error";
	}
//
// 	mainLog.log(level, JSON.stringify(error_data));
}

//
// GLOBAL.logv =
// function logv(v)
// {
// 	mainLog.log("info", JSON.stringify(v));
// }
