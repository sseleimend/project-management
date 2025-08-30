export const emailVerification = (username, url) => {
  const emailVerificationTemplate = {
    body: {
      name: username,
      intro: "Welcome to our app! We're excited to have you on board.",
      action: {
        instructions: "Click the button below to verify your email:",
        button: {
          color: "#22BC66",
          text: "Verify Email",
          link: url,
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

export const forgotPassword = (username, url) => {
  const forgotPasswordTemplate = {
    body: {
      name: username,
      intro: "We're sorry to hear that you've forgotten your password.",
      action: {
        instructions: "Click the button below to reset your password:",
        button: {
          color: "#22BC66",
          text: "Reset Password",
          link: url,
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
