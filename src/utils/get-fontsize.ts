import { SemanticSIZES } from "semantic-ui-react";
import { pageSizeSet } from "../AppModel";
import RootStore from "../RootStore";
const { appStore } = RootStore;

type sizeType = "Text" | "Header";
const arrayOfTextSize = ["mini", "tiny", "small", "medium", "large", "big", "huge", "massive"];
const arrayOfHeaderSize = ["tiny", "small", "medium", "large", "huge"];
const arrayOfFormInputSize = ["mini", "tiny", "small", "large", "big", "huge", "massive"];
const arrayOfButtonSize = ["mini", "tiny", "small", "medium", "large", "big", "huge", "massive"];
const arrayOfIconSize = ["mini", "tiny", "small", "large", "big", "huge", "massive"];
const arrayOfInputSIze = ["mini", "small", "large", "big", "huge", "massive"];

export const getSize = (currentSize: SemanticSIZES, type: sizeType) => {
  let index;
  let step;
  let arrayOfSize;
  switch (type) {
    case "Text":
      step = 1;
      arrayOfSize = arrayOfTextSize;
      break;
    case "Header":
      step = 2;
      arrayOfSize = arrayOfHeaderSize;
      break;
    default:
      step = 1;
      arrayOfSize = arrayOfTextSize;
  }
  index = arrayOfSize.findIndex((element: any) => {
    return element === currentSize;
  });
  return getSizeByPageSize(index, step, arrayOfSize);
};

const getSizeByPageSize = (index: number, step: number, array: string[]) => {
  const pageSize = appStore.pageSize;
  switch (pageSize) {
    case pageSizeSet.small:
      return index !== 0 ? array[index - step] : array[0];
    case pageSizeSet.regular:
      return array[index];
    case pageSizeSet.big:
      return index + 1 !== array.length ? array[index + step] : array[array.length - 1];
  }
};
