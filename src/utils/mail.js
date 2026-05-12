import { text } from "express";
import mailgen from "mailgen";

const emailVerificationMailgenContent = (username, verificationUrl) => {
  return {
    body: {
      name: username,
      intro: "Welcome to our App! we are excited to have you on board.",
      action: {
        instruction:
          "To verify your email please click on the following button",
        button: {
          color: "#22BC66",
          text: "Verify your email",
          link: verificationUrl,
        },
      },
      outro:
        "Need help or have questions? Just reply to this email, we'd love to help",
    },
  };
};

const forgotPasswordMailgenContent = (username, passwordresetUrl) => {
  return {
    body: {
      name: username,
      intro: "We got a request to reset the password of your account.",
      action: {
        instruction:
          "To reset your password click on the following button or link",
        button: {
          color: "#22BC66",
          text: "Reset Password",
          link: passwordresetUrl,
        },
      },
      outro:
        "Need help or have questions? Just reply to this email, we'd love to help",
    },
  };
};


export {emailVerificationMailgenContent , forgotPasswordMailgenContent}