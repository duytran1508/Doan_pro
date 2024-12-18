const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { status } = require("express/lib/response");
dotenv.config();

const genneralAccessToken = async (payload) => {
  const access_token = jwt.sign(
    {
      payload
    },
    process.env.ACCESS_TOKEN,
    { expiresIn: "1d" }
  );

  return access_token;
};

const genneralRefreshToken = async (payload) => {
  const refresh_token = jwt.sign(
    {
      payload
    },
    process.env.REFRESH_TOKEN,
    { expiresIn: "365d" }
  );

  return refresh_token;
};

const refreshTokenJwtService = (token) => {
  return new Promise((resolve, reject) => {
    try {
      jwt.verify(token, process.env.REFRESH_TOKEN, async (err, user) => {
        if (err) {
          resolve({
            status: "ERROR",
            message: "The authemtication"
          });
        }
        const { payload } = user;
        const access_token = await genneralAccessToken({
          id: payload.id,
          isAdmin: payload?.isAdmin
        });
        resolve({
          status: "Oke",
          massage: "success",
          access_token
        });
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  genneralAccessToken,
  genneralRefreshToken,
  refreshTokenJwtService
};
