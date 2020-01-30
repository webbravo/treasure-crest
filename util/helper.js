const moment = require("moment");

module.exports.MySQLStoreOptions = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: "",
  database: process.env.DATABASE
};

module.exports.redirect_to = (req, res, location) => {
  const targetBaseUrl = () =>
    process.env.NODE_ENV === "production" ?
    process.env.SITE_NAME :
    `http://localhost:${process.env.PORT}/`;

  const targetUrl = targetBaseUrl() + location;
  return res.redirect(targetUrl);
};

module.exports.added_by = (req, res, next) => {
  console.log(req.session.teacherName);
};

module.exports.formatDate = (date, time = true) => {
  if (time) {
    return moment(date).format("MMM Do YYYY, h:mm:ss a");
  }
  return moment(date).format("MMM Do YYYY");
}