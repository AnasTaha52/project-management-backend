import { body } from "express-validator";
import {AvailableUserRole} from "../utils/constants.js"

const userRegisterValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is Invalid"),
    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username is required")
      .isLowercase()
      .withMessage("Username must be in lower case")
      .isLength({ min: 3 })
      .withMessage("Username must be at least 3 characters long."),
    body("password").trim().notEmpty().withMessage("password is required"),
    body("fullname").optional().trim(),
  ];
};

const userLoginValidator = () => {
  return [
    body("email").optional().isEmail().withMessage("Email is Invalid"),
    body("password").notEmpty().withMessage("passwordis required"),
  ];
};

const userChangeCurrentPasswordValidator = () => {
  return [
    body("oldPassword").notEmpty().withMessage("password is required"),
    body("newPassword").notEmpty().withMessage("New password is required"),
  ];
};

const userForgotPasswordValidator = () => {
  return [
    body("email")
      .notEmpty()
      .withMessage("email is required")
      .isEmail()
      .withMessage("email is Invalid"),
  ];
};

const userResetForgotPasswordValidator = () => {
  return [
    body("newPassword")
      .notEmpty()
      .withMessage("password is required")
  ];
};

const createProjectValidator = () => {
  return [
    body("name")
      .notEmpty()
      .withMessage("Name is required"),
    body("description")
      .optional()
  ]
}

const addMemberToProjectValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is Invalid!"),
    body("role")
      .notEmpty()
      .withMessage("Role is required")
      .isIn(AvailableUserRole)
      .withMessage("Role is invalid"),
  ];
}

export {
  userRegisterValidator,
  userLoginValidator,
  userChangeCurrentPasswordValidator,
  userForgotPasswordValidator,
  userResetForgotPasswordValidator,
  createProjectValidator,
  addMemberToProjectValidator,
};
