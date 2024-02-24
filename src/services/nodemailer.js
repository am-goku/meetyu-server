import nodemailer, { createTransport } from "nodemailer";
import { verificationMail } from "./templates/email-templates.js";

import dotenv from "dotenv";

dotenv.config();



export async function sent_verification_mail (email, name, token) {
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

    const link = `${process.env.BASEURL}/api/v1/auth/verify/${email}/${token}`
    const template = verificationMail(name, link)

    await transporter.sendMail({
      from: process.env.NM_MAIL,
      to: email,
      subject: "Meetyu Verification",
      html: template
    })

    return
}