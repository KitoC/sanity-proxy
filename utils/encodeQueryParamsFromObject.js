const encodeQueryParamsFromObject = (object = {}, { whitelist } = {}) => {
  return Object.entries(object || {}).reduce(
    (queryParams, [nextKey, nextValue], index) => {
      if (whitelist && !whitelist.includes(nextKey)) return;

      const value =
        typeof nextValue === "string" && !["query"].includes(nextKey)
          ? encodeURIComponent(`"${nextValue}"`)
          : encodeURIComponent(nextValue);

      if (index === 0) {
        return (queryParams += `?${nextKey}=${value}`);
      }

      return (queryParams += `&${nextKey}=${value}`);
    },
    ""
  );
};

module.exports = encodeQueryParamsFromObject;
