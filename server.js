const dotenv = require("dotenv");
dotenv.config();

const { ClerkExpressWithAuth } = require("@clerk/clerk-sdk-node");
const express = require("express");
const cors = require("cors");
const querySanity = require("./middleware/querySanity");
const mutationSanity = require("./middleware/mutationSanity");

const bodyParser = require("body-parser");

const jsonParser = bodyParser.json();
const port = process.env.PORT || 3000;

const app = express();

app.use(jsonParser);
app.use(cors());
app.use(ClerkExpressWithAuth());

app.post("/query", querySanity);
app.post("/mutation", mutationSanity);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
