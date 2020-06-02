module.exports = {
  DB_NAME: process.env.DB_NAME,
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASS: process.env.DB_PASS,

  MAIL_HOST: process.env.MAIL_HOST,
  MAIL_PORT: process.env.MAIL_PORT,
  MAIL_SENDER: process.env.MAIL_SENDER,
  MAIL_USER: process.env.MAIL_USER,
  MAIL_PASSWORD: process.env.MAIL_PASSWORD,

  JWT_SECRET: process.env.JWT_SECRET,
  JWT_SECRET_ADMIN: process.env.JWT_SECRET_ADMIN,
  JWT_EXPIRY_TOKEN: parseInt(process.env.JWT_TOKEN_EXPIRY, 10),

  MAPS_API_KEY: process.env.MAPS_API_KEY
};
