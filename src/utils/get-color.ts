import { COLORS } from "../constants";
import { ColorProp } from "../constants/type";

export const getColor = (color?: ColorProp) => {
  switch (color) {
    case 1:
      return COLORS.darkOrange;
    case 2:
      return COLORS.darkGrey;
    case 3:
      return COLORS.lightGrey;
    case 4:
      return COLORS.disabledGrey;
    case 5:
      return COLORS.blue;
    default:
      return COLORS.lightGrey;
  }
};

export const colorSetUser = (index: number) => {
  const colorList = [
    "orange",
    "yellow",
    "olive",
    "green",
    "teal",
    "blue",
    "violet",
    "purple",
    "pink",
    "brown",
    "grey"
  ];
  if (index > 10) {
    return colorList[index % 10];
  } else {
    return colorList[index];
  }
};
