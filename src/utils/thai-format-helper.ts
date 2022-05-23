import iconv from "iconv-lite";

export const validateUpper = (char: number) => {
  return (
    char === 209 || (char >= 212 && char <= 215) || (char >= 231 && char <= 238)
  );
};
export const validateLower = (char: number) => {
  return char >= 216 && char <= 218;
};
export const calMainChar = (text: string) => {
  let count = 0;
  const ascii = iconv.encode(text, "TIS-620");
  const length = Array.from(Array(+ascii.length).keys());
  length.forEach((index: number) => {
    if (!(validateUpper(ascii[index]) || validateLower(ascii[index]))) {
      count += 1;
    }
  });
  return count;
};
export const calIndexSubString = (text: string,indexCalMainChar: number) => {
  console.log('text',text);
  console.log('indexCalMainChar',indexCalMainChar);
  let count = 0;
  let indexText = 0;
  const ascii = iconv.encode(text, "TIS-620");
  const length = Array.from(Array(+ascii.length).keys());
  length.forEach((index: number) => {
    if (!(validateUpper(ascii[index]) || validateLower(ascii[index]))) {
      count += 1;
      // console.log('count',count);
      if(count==indexCalMainChar){
        indexText=index;
      }else if(count<indexCalMainChar){
        indexText=indexCalMainChar-1;
      }
    }
  });
  console.log('indexText',indexText);
  return indexText;
};

export const calUpperLowerChar = (text: string, lengthMainChar: number) => {
  let count = 0;
  let countUpperLower = 0;
  const ascii = iconv.encode(text, "TIS-620");
  const length = Array.from(Array(+ascii.length).keys());
  length.forEach((index: number) => {
    if (count < lengthMainChar) {
      if (!(validateUpper(ascii[index]) || validateLower(ascii[index]))) {
        count += 1;
      } else {
        countUpperLower += 1;
      }
    } else {
      return countUpperLower;
    }
  });
  return countUpperLower;
};

export const mainCharLabel = (
  text: string,
  length: number,
  positionRight?: boolean,
  nonSpaceText?: boolean
) => {
  const count = calMainChar(text);
  if (count < length) {
    const spaceText = `${" "}`;
    const diff = +length - +count;
    if (nonSpaceText) {
      return `${text}`;
    } else {
      return positionRight
        ? `${spaceText.repeat(+diff)}${text}`
        : `${text}${spaceText.repeat(+diff)}`;
    }
  } else {
    const upperLower = calUpperLowerChar(text, length);
    const lengthtext = +upperLower + length;
    return text.substring(0, +lengthtext);
  }
};
