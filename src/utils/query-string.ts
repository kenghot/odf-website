export const concatQuery = (queries: any) => {
  let queryString = "";
  Object.keys(queries).forEach(key => {
    const query =
      queries[key] !== "" && queries[key] !== undefined
        ? `${key}=${queries[key]}`
        : "";
    const devider = query ? "&" : "";
    queryString = queryString ? `${queryString}${devider}${query}` : query;
    // const query = `${key}=${queries[key]}`;
    // queryString = queryString ? `${queryString}&${query}` : query;
  });
  return queryString;
};
