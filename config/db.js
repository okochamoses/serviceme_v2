const mongoose = require("mongoose");
const logger = require("./logger");
const { DB_HOST, DB_NAME, DB_PASS, DB_USER } = require("./keys");

let url;
if(!DB_USER || DB_USER === "" ) {
  url=`mongodb://${DB_HOST}/${DB_NAME}&authSource=admin`;
} else {
  url=`mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}`;
}

mongoose
  .connect(url, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false, useUnifiedTopology: true })
  .then(() => {
    logger.info("Database connection established");
  })
  .catch(err => {
    logger.info(err);
  });

module.exports = mongoose;
