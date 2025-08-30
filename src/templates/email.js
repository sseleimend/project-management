import { env } from "../config/env.js";

export const emailVerification = (username, token) => {
  const emailVerificationTemplate = {
    body: {
      name: username,
      intro: "Welcome to our app! We're excited to have you on board.",
      action: {
        instructions: "Click the button below to verify your email:",
        button: {
          color: "#22BC66",
          text: "Verify Email",
          link: `${env.BASE_URL}/verify-email?token=${token}`,
        },
      },
    },
    outro: {
      name: username,
      instructions: "Need help? Contact our support team.",
    },
  };

  return emailVerificationTemplate;
};

export const forgotPassword = (username, token) => {
  const forgotPasswordTemplate = {
    body: {
      name: username,
      intro: "We're sorry to hear that you've forgotten your password.",
      action: {
        instructions: "Click the button below to reset your password:",
        button: {
          color: "#22BC66",
          text: "Reset Password",
          link: `${env.BASE_URL}/reset-password?token=${token}`,
        },
      },
    },
    outro: {
      name: username,
      instructions: "Need help? Contact our support team.",
    },
  };

  return forgotPasswordTemplate;
};

export default {
  emailVerification,
  forgotPassword,
};
