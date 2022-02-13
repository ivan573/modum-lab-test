const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

export default (url, categories, page) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  const body = categories && page ? JSON.stringify({categories, page}) : null;
  if (body) options.body = body;

  return fetch(`https://webdev.modumlab.com/api/book/${url}`, options)
    .then(checkStatus)
    .then(res => res.json())
    .catch(err => {
      throw new Error(err);
    });
};