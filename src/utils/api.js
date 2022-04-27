export function buildPath(path, params = {}) {
  if (typeof path !== 'string' || path instanceof String) throw new Error("Path should be of String type!");
  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      path = path.replace(`:${key}`, params[key]);
    }
  }
  const match = path.match(/:(\w*)/g);
  if (match) {
    throw Error(`Path parameter(s) [${match}] is (are) required!`);
  }
  return path;
}

export function buildQueryString(params = {}) {
  const query = [];
  for (const key in params) {
    if (params.hasOwnProperty(key) && params[key] !== null && params[key] !== undefined) {
      query.push(`${key}=${params[key]}`);
    }
  }
  return query.join('&');
}

export function buildUrl(path, {pathParams = {}, queryParams = {}} = {}) {
  path = buildPath(path, pathParams);
  const query = buildQueryString(queryParams);
  if (query.length > 0) return `${path}?${query}`;
  return path;
}
