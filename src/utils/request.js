const request = object => {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open(object.method || "GET", object.url);
    if (object.headers) {
      Object.keys(object.headers).forEach(key => {
        xhr.setRequestHeader(key, object.headers[key]);
      });
    }
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.response));
      } else {
        reject({
          status: xhr.status,
          statusText: xhr.statusText
        });
      }
    };
    xhr.onerror = () =>
      reject({
        status: xhr.status,
        statusText: xhr.statusText
      });
    xhr.send(object.body);
  });
};

export default request;
