import * as EmailValidator from "email-validator";

const USER_ID_REGEX = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;

export const isValidUserId = (value: string) => {
  return USER_ID_REGEX.test(value);
};

export const isValidUserName = (value: string) => {
  return value.length > 0 && value.length < 51;
};

export const isValidEmail = (value: string) => {
  return EmailValidator.validate(value);
};

export const isValidPassword = (value: string) => {
  return value.length > 5;
};

export const isValidPasswordConfirmation = (
  password: string,
  confirmation: string
) => {
  return password === confirmation;
};

export const isValidBrithdate = (date: string) => {
  const now = new Date();
  return new Date(date) < now;
};

export const optionFieldWrapper = (
  value: string,
  callback: (value: string) => boolean
) => {
  return value === "" ? true : callback(value);
};
