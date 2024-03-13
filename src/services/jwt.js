import jwt from "jsonwebtoken";

//.env configuration
import dotenv from "dotenv";
dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET_KEY_1.concat(
  process.env.JWT_SECRET_KEY_2
);

export async function sign_access_token(payload) {
  return new Promise((resolve, reject) => {
    try {
      const accessToken = jwt.sign(payload, SECRET_KEY, {
        expiresIn: 10000,
      });
      resolve(accessToken);
    } catch (error) {
      reject(error);
    }
  });
}

export async function sign_refresh_token(payload) {
  return new Promise((resolve, reject) => {
    try {
      const refreshToken = jwt.sign(payload, SECRET_KEY, {
        expiresIn: "10d",
      });
      resolve(refreshToken);
    } catch (error) {
      reject(error);
    }
  });
}

export async function decode_token(token) {
  return new Promise((resolve, reject) => {
    try {
      const data = jwt.decode(token);
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
}
