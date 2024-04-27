const sanityService = require("../services/sanity");

const querySanity = async (req, res) => {
  // TODO: extract userId from clerk
  const userId = req.headers["x-user-id"];

  const data = await sanityService.query(
    req.body.query,
    userId,
    req.body.variables
  );

  res.json(data);
};

module.exports = querySanity;
