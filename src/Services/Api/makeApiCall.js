// Define the default body parameters
const DEFAULT_BODY_PARAMS = { dealer_id: 11111 };

// Function to serialize an object into query parameters
const serializeToQueryParams = (obj) => {
  const str = [];
  for (const p in obj) {
    if (obj.hasOwnProperty(p)) {
      let encodedValue = encodeURIComponent(obj[p]);
      // Replace any encoded "/" (%2F) with "/"
      encodedValue = encodedValue.replace(/%2F/g, "/");
      str.push(encodeURIComponent(p) + "=" + encodedValue);
    }
  }
  return str.join("&");
};

// Function to make API calls with fetch
export const makeApiCall = async (
  url,
  method = 'GET',
  data = {}
) => {
  const requestOptions = {
    method,
    headers: {
      // Add authorization token to the request headers
      // 'Authorization': `Bearer ${AUTH_TOKEN}`,
    },
  };

  let bodyData;

  if (method === 'GET') {
    const queryParams = serializeToQueryParams({ ...DEFAULT_BODY_PARAMS, ...data });
    url += `?${queryParams}`;
  } else {
    // Create FormData object
    const formData = new FormData();
    // Append default parameters
    for (const key in DEFAULT_BODY_PARAMS) {
      if (DEFAULT_BODY_PARAMS.hasOwnProperty(key)) {
        formData.append(key, String(DEFAULT_BODY_PARAMS[key]));
      }
    }
    // Append additional data parameters
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        formData.append(key, String(data[key]));
      }
    }
    bodyData = formData;
  }

  if (bodyData) {
    requestOptions.body = bodyData;
  }

  try {
    const response = await fetch(url, requestOptions);
    return await response.json();
  } catch (error) {
    console.error(`API call failed for ${url}: ${error.message}`);
    throw error; // Re-throw the error after logging it
  }
};
