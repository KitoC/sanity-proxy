const sanityService = require("../services/sanity");

const mutationSanity = async (req, res) => {
  try {
    // TODO: extract userId from clerk
    const userId = req.headers["x-user-id"];

    const data = await sanityService.mutation(
      req.body.mutations,
      userId,
      req.body.options
    );

    res.json(data);
  } catch (e) {
    res.json(e?.response?.data || e);
  }
};

module.exports = mutationSanity;
