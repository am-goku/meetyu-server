import { User } from "../models/user-schema.js";
import { compare_password, hash_password } from "../services/bcrypt.js";
import { sign_access_token, sign_refresh_token } from "../services/jwt.js";
import { sent_verification_mail } from "../services/nodemailer.js";



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
        });
        const refreshToken = await sign_refresh_token({
          userId: user?._id,
          email: user?.email,
        });
        delete user?.password;
        resolve({ accessToken, refreshToken, user });
      }
    } catch (error) {
      reject({ status: 500, message: "Server error" });
    }
  });
};


// @desc   Register login
// @Route  POST /api/v1/user/register
// @access Public
export const register_helper = ({name, email, pass, confPass}) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (pass !== confPass)
              return reject({
                status: 400,
                message: "Password doesn't match.",
              });

            if (await User.find({ email: email }))
              return reject({
                status: 409,
                message: "Email has already been registerd.",
              });

            const newUser = new User({
              email,
              password: await hash_password(pass),
              name,
            });

            await newUser.save();

            const token = crypto.randomBytes(96).toString("hex");
            console.log(token)

            sent_verification_mail(email, name, token)

            resolve({ status: 200, message: "Verify you email." });
        } catch (error) {
            reject({status: 500, message: "Internal server error", error})
        }
    })
}