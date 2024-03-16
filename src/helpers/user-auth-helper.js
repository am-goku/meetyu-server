import { Auth } from "../models/auth-schema.js";
import { User } from "../models/user-schema.js";
import { compare_password, hash_password } from "../services/bcrypt.js";
import { sign_access_token, sign_refresh_token } from "../services/jwt.js";
import { sent_verification_mail } from "../services/nodemailer.js";
import crypto from "crypto";

// @desc   User login
// @Route  POST /api/v1/user/login
// @access Public
export const login_helper = ({ email, password }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({ email: email });

      if (!user) return reject({ status: 404, message: "User not found" });

      const passMatch = await compare_password(password, user?.password);

      if (!passMatch) return reject({ status: 400, message: "Wrong password" });

      if (user && passMatch) {
        const accessToken = await sign_access_token({
          userId: user?._id,
          email: user?.email,
          role: user?.role
        }); //Fetch the access token
        const refreshToken = await sign_refresh_token({
          userId: user?._id,
          email: user?.email,
          role: user?.role
        }); //Fetching the refresh token

        const transformedUser = user.toObject(); //Converting the mongoose document object to plain object
        delete transformedUser.password; //deleining the password from user data

        resolve({
          status: 200,
          accessToken,
          refreshToken,
          user: transformedUser,
        });
      }
    } catch (error) {
      reject({ status: 500, message: "Server error" });
    }
  });
};

// @desc   Register login
// @Route  POST /api/v1/user/register
// @access Public
export const register_helper = ({ name, email, pass, confPass }) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (pass !== confPass)
        return reject({
          status: 400,
          message: "Password doesn't match.",
        });

      if (await User.findOne({ email: email }))
        return reject({
          status: 409,
          message: "Email has already been registerd.",
        });

      const token = crypto.randomBytes(96).toString("hex"); //Generating token for sending authmail

      const newUser = new User({
        email,
        password: await hash_password(pass),
        name,
      });
      const newAuth = new Auth({ email, token });

      sent_verification_mail(email, name, token)
        .then(async (response) => {
          await newAuth.save();
          await newUser.save();
          resolve({ status: 200, ...response });
        })
        .catch((err) => {
          console.log(err);
          reject({ status: 500, ...err });
        });
    } catch (error) {
      reject({ status: 500, message: "Internal server error", error });
    }
  });
};

// @desc   Email verification
// @Route  POST /api/v1/auth/:email/verify/:token
// @access Public
export const auth_helper = ({ token, email }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const currentTime = new Date();
      Auth.findOne({ email, token })
        .then(async (auth) => {
          const createdAt = auth.createdAt;
          const diffInMs = currentTime - createdAt;
          const diffInHrs = diffInMs / (1000 * 60 * 60);

          if (diffInHrs > 24) {
            return reject({ status: 410, message: "Token has been expired" });
          }

          await User.updateOne({ email }, { $set: { emailVerified: true } });
          resolve({ status: 200, message: "Email has been verified." });
        })
        .catch((err) => {
          reject({ status: 410, message: "Token is not valid", err });
        });
    } catch (error) {
      reject({ status: 500, message: "Internal server error", error });
    }
  });
};


// @desc   Token refresh
// @Route  POST /api/v1/auth/refresh-token
// @access Public
export const tokenRefresh_helper = ( user ) => {
  return new Promise((resolve, reject) => {
    try {
      const newAccessToken = sign_access_token({
        userId: user?._id,
        email: user?.email,
        role: user?.role,
      });

      return resolve({
        status: 200,
        message: "Created new access token",
        newAccessToken,
      });
    } catch (error) {
      reject({ status: 500, message: "Internal server error", error });
    }
  });
};