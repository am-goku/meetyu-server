import nodemailer, { createTransport } from "nodemailer";
import { verificationMail } from "./templates/email-templates.js";

import dotenv from "dotenv";

dotenv.config();

export async function sent_verification_mail(email, name, token) {
  return new Promise(async (resolve, reject) => {
    try {
      const transporter = createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.NM_MAIL,
          pass: process.env.NM_PASSWORD,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });

      //imp
      //Has to change the link upon the client site requirements.
      //Current link should be removed and should replace with client side link.
      const link = `${process.env.BASE_URL}/api/v1/auth/${email}/verify/${token}`;
      const template = verificationMail(name, link);

      await transporter
        .sendMail({
          from: process.env.NM_MAIL,
          to: email,
          subject: "Meetyu Verification",
          html: template,
        })
        .then(() => {
          resolve({
            message: "Verification mail sent successfully.",
          });
        })
        .catch((err) => {
          reject({
            err,
            message: "Error sending verification mail",
          });
        });
    } catch (error) {
      reject({
        error,
        message: "Error sending verification mail",
      });
    }
  });
}
