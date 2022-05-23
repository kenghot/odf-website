import { fromEvent } from "file-selector";

// export { errorHandler } from "./error-handler";
// export { getCurrentPosition } from "./geolocation";
export { concatQuery } from "./query-string";
export { default as request } from "./request-helper";
// export { ApiHelper, IApiResponse } from "./api-helper";
export {
  date_YYYYMMDD_BE_TO_CE,
  dateFormating,
  dateFormatingYYYYMMDD,
  date_YYYYMMDD_TO_DDMMYYYY,
  monthYear_display_CE_TO_BE,
  idcardFormatting,
  date_display_CE_TO_BE,
  month_display_CE_TO_BE,
  dateTime_display_CE_TO_BE,
  date_To_Time
} from "./format-helper";
export {
  calMainChar,
  mainCharLabel,
  validateLower,
  validateUpper,
  calIndexSubString
} from "./thai-format-helper";
export {
  convertFullMoney,
} from "./money-to-thai-text";
export { isValidDate, isInValidThaiIdCard } from "./validation-helper";
export { EPosDevice } from "./printer-epson";
