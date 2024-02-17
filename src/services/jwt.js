import jwt from "jsonwebtoken";

//.env configuration
import dotenv from "dotenv"
dotenv.config()

const SECRET_KEY = process.env.JWT_SECRET_KEY_1.concat(process.env.JWT_SECRET_KEY_2);


export async function sign_access_token (payload) {
    try {
        const accessToken = jwt.sign(payload, SECRET_KEY, {expiresIn:10000});
        Promise.resolve(accessToken)
    } catch (error) {
        Promise.reject(error)
    }
};

export async function sign_refresh_token (payload) {
    try {
        const refreshToken = jwt.sign(payload, SECRET_KEY, { expiresIn: '10d' });
        Promise.resolve(refreshToken)
    } catch (error) {
        Promise.reject(error)
    }
}

export async function decode_token (token) {
    try {
        const data = jwt.decode(token);
        Promise.resolve(data);
    } catch (error) {
        Promise.reject(error)
    }
}

