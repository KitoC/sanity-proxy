const { keys } = require("lodash");
const api = require("../utils/api");
const encodeQueryParamsFromObject = require("../utils/encodeQueryParamsFromObject");

const sanityService = {
  async baseQuery(query, variables = {}) {
    const encodedQuery = encodeQueryParamsFromObject({ ...variables, query });

    const { data } = await api.get(
      `/data/query/${process.env.SANITY_DATASET}${encodedQuery}`
    );

    return data;
  },
  async query(query, userId, variables) {
    const replacementString = userId
      ? ` && userId == $userId]`
      : ` && (!defined(private) || !private)]`;

    const mutatedQuery = query.replace("]", replacementString);

    return this.baseQuery(mutatedQuery, { ...variables, ["$userId"]: userId });
  },
  async mutation(mutations, userId, options = {}) {
    const MUTATION_OPTIONS_WHITELIST = [
      "returnIds",
      "returnDocuments",
      "autoGenerateArrayKeys",
      "transactionId",
      "skipCrossDatasetReferenceValidation",
      "visibility",
      "dryRun",
      "tag",
    ];

    const sanitizedMutations = mutations.map((mutation) => {
      const key = keys(mutation)[0];

      if (key.includes("create")) {
        return { [key]: { ...mutation[key], userId } };
      }

      return { [key]: { ...mutation[key] } };
    });

    const query = `*[${sanitizedMutations.reduce(
      (queryString, mutation, index) => {
        const key = keys(mutation)[0];
        if (key === "create") return queryString;

        const _id = mutation[key]._id || mutation[key].id;

        const subQuery = `(_id == "${_id}")`;

        if (index === 0) return (queryString += `${subQuery}`);

        return (queryString += ` || ${subQuery}`);
      },
      ""
    )}]`;

    const { result } = await this.baseQuery(query);

    const validMutations = sanitizedMutations.filter((mutation) => {
      const key = keys(mutation)[0];
      const document = result.find(
        (doc) => doc._id === mutation[key]._id || doc._id === mutation[key].id
      );

      if (!document) return true;

      return document.userId === userId;
    });

    const optionsQuery = encodeQueryParamsFromObject(options, {
      whitelist: MUTATION_OPTIONS_WHITELIST,
    });

    const { data } = await api.post(
      `/data/mutate/${process.env.SANITY_DATASET}${optionsQuery || ""}`,
      { mutations: validMutations }
    );

    return data;
  },
};

module.exports = sanityService;
