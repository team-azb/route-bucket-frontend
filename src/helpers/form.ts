import { ValidationErrorCode } from "../types";

export const errorCode2ErrorMessage = (
  code: ValidationErrorCode | undefined,
  invalidFormatMsg: string,
  alreadyExistsMsg = "",
  reservedWordMsg = ""
): string => {
  switch (code) {
    case "INVALID_FORMAT":
      return invalidFormatMsg;
    case "ALREADY_EXISTS":
      return alreadyExistsMsg;
    case "RESERVED_WORD":
      return reservedWordMsg;
    default:
      return "";
  }
};
