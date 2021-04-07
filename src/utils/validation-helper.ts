export const isValidDate = (d: any) => {
  if (d instanceof Date) { return true; }
  else if (!isNaN(d)) { return true; }
  else { return false; }
}
export const isInValidThaiIdCard = (idCardNo: string) => {
  if (idCardNo.length === 13) {
    const digit: any = idCardNo.split("");
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += digit[i] * (13 - i);
    }
    const mod11 = sum % 11;
    const checksum = mod11 > 1 ? 11 - mod11 : 1 - mod11;

    return `${checksum}` !== digit[12];
  } else {
    return false;
  }
}