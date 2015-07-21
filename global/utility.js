
GLOBAL.extract_param_value_from_url =
function extract_param_value_from_url(url, param_name)
{
	if (!url)
	{
		return undefined;
	}

	var param_start = url.indexOf(param_name + "=");
	if (param_start === -1)
	{
		return undefined;
	}

	var param_value_start = param_start + param_name.length + 1;
	var param_value_end = url.indexOf("&", param_value_start);
	if (param_value_end === -1)
	{
		return url.substring(param_value_start);
	}
	else
	{
		return url.substring(param_value_start, param_value_end);
	}
}
