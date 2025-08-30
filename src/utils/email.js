import Mailgen from "mailgen";
import nodemailer from "nodemailer";

import { env } from "../config/env.js";

export const sendEmail = async (to, subject, template) => {
  const mailgen = new Mailgen({
    theme: "default",
    product: {
      name: "Task Manager",
      link: env.BASE_URL,
    },
  });

  const plaintext = mailgen.generatePlaintext(template);
  const html = mailgen.generate(template);

  const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    auth: {
      user: env.SMTP_USERNAME,
      pass: env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: env.SMTP_FROM,
    to,
    subject,
    text: plaintext,
    html,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
