import moment from "moment";

export const idcardFormatting = (original: any) => {
  const cleaned = ("" + original).replace(/\D/g, "");
  let formated = cleaned;
  const conditionList = [
    /^(\d{1})(\d{1,4})$/,
    /^(\d{1})(\d{1,4})(\d{1,5})$/,
    /^(\d{1})(\d{1,4})(\d{1,5})(\d{1,2})$/,
    /^(\d{1})(\d{1,4})(\d{1,5})(\d{1,2})(\d{1})$/
  ];
  const BreakException = {};
  try {
    conditionList.forEach((condition: any, index: number) => {
      const match = cleaned.match(condition);
      if (match) {
        formated = match.slice(1, match.length).join("-");
        throw BreakException;
      }
    });
  } catch (e) {
    if (e !== BreakException) throw e;
  }
  return formated;
};

export const dateFormating = (original: any, divider?: string) => {
  const cleaned = ("" + original).replace(/\D/g, "");
  let formated = cleaned;
  const conditionList = [/^(\d{2})(\d{1,2})$/, /^(\d{2})(\d{1,2})(\d{1,4})$/];
  const BreakException = {};
  try {
    conditionList.forEach((condition: any, index: number) => {
      const match = cleaned.match(condition);
      if (match) {
        formated = match.slice(1, match.length).join(divider ? divider : "/");
        throw BreakException;
      }
    });
  } catch (e) {
    if (e !== BreakException) throw e;
  }
  return formated;
};
export const dateFormatingYYYYMMDD = (original: any) => {
  const cleaned = ("" + original).replace(/\D/g, "");
  let formated = cleaned;
  const conditionList = [/^(\d{4})(\d{1,2})$/, /^(\d{4})(\d{1,2})(\d{1,2})$/];
  const BreakException = {};
  try {
    conditionList.forEach((condition: any, index: number) => {
      const match = cleaned.match(condition);
      if (match) {
        formated = match.slice(1, match.length).join("-");
        throw BreakException;
      }
    });
  } catch (e) {
    if (e !== BreakException) throw e;
  }
  return formated;
};

export const date_To_Time = (value: any, short?: boolean) => {
  const date = moment(value);
  return date.isValid() ? date.format(short ? "LT" : "LTS") : "-";
};
export const dateTime_display_CE_TO_BE = (value: any, short?: boolean) => {
  const date = moment(value);
  return date.isValid()
    ? date
        .add("years", 543)
        .format(short ? "Do MMM YY : HH:mm" : "Do MMMM YYYY : HH:mm")
    : "-";
};
export const date_display_CE_TO_BE = (value: any, short?: boolean) => {
  const date = moment(value);
  return date.isValid()
    ? date.add("years", 543).format(short ? "DD MMM YY" : "DD MMMM YYYY")
    : "-";
};
export const monthYear_display_CE_TO_BE = (value: any, short?: boolean) => {
  const date = moment(value);
  return date.isValid()
    ? date.add("years", 543).format(short ? "MMM YY" : "MMMM YY")
    : "-";
};
export const month_display_CE_TO_BE = (value: any, short?: boolean) => {
  const date = moment(value);
  return date.isValid()
    ? date.add("years", 543).format(short ? "MMM" : "MMMM")
    : "-";
};
export const date_YYYYMMDD_TO_DDMMYYYY = (original: any) => {
  const cleaned = ("" + original).replace(/\D/g, "");
  const match = cleaned.match(/^(\d{4})(\d{2})(\d{2})$/);
  return match ? match[3] + match[2] + match[1] : cleaned;
};

export const date_YYYYMMDD_BE_TO_CE = (original: any, divider?: string) => {
  const cleaned = ("" + original).replace(/\D/g, "");
  const match = cleaned.match(/^(\d{4})(\d{2})(\d{2})$/);
  const div = divider ? divider : "-";
  return match
    ? (+match[1] - 543).toString() + div + match[2] + div + match[3]
    : cleaned;
};

export const date_YYYYMMDD_TO_DDMMYYYY_CE_TO_BE = (original: any) => {
  const cleaned = ("" + original).replace(/\D/g, "");
  const match = cleaned.match(/^(\d{4})(\d{2})(\d{2})$/);
  return match ? match[3] + match[2] + (+match[1] + 543).toString() : cleaned;
};

export const date_DDMMYYYY_TO_YYYYMMDD_BE_TO_CE = (
  original: any,
  divider?: string
) => {
  const cleaned = ("" + original).replace(/\D/g, "");
  const match = cleaned.match(/^(\d{2})(\d{2})(\d{4})$/);
  const div = divider ? divider : "-";
  return match
    ? (+match[3] - 543).toString() + div + match[2] + div + match[1]
    : cleaned;
};

export const date_DDMMYYYY_TO_YYYYMMDD = (original: any, divider?: string) => {
  const cleaned = ("" + original).replace(/\D/g, "");
  const match = cleaned.match(/^(\d{2})(\d{2})(\d{4})$/);

  const div = divider ? divider : "-";
  return match ? match[3] + div + match[2] + div + match[1] : cleaned;
};

/**
 * Number.prototype.format(n, x)
 *
 * param integer n: length of decimal
 * param integer x: length of sections
 */
export const currency = (value: any, n?: number, x?: number): string => {
  const _n = n || 0;
  const _x = x || 3;
  if (value || value === 0) {
    const calVal = value instanceof Number ? value : +value;
    const re = "\\d(?=(\\d{" + _x + "})+" + (_n > 0 ? "\\." : "$") + ")";

    return calVal
      .toFixed(Math.max(0, ~~_n))
      .replace(new RegExp(re, "g"), "$&,");
  } else {
    return "0.00";
  }
};

// 1234..format();           // "1,234"
// 12345..format(2);         // "12,345.00"
// 123456.7.format(3, 2);    // "12,34,56.700"
// 123456.789.format(2, 4);  // "12,3456.79"
