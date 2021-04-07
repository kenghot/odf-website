import moment from "moment";
import "moment/locale/th";
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Label, SemanticSIZES } from "semantic-ui-react";
import { ColorProp } from "../../../constants/type";
import { getColor } from "../../../utils/get-color";
export interface IDateText extends WithTranslation {
  size?: SemanticSIZES;
  shade?: ColorProp;
  children: string;
  className?: string;
  style?: any;
  formatDate?: "longDate" | "longDateTime" | "month";
  notConvertToBE?: boolean;
}

class DateText extends React.Component<IDateText> {
  public render() {
    const { style, className, children, notConvertToBE } = this.props;
    const textColor = this.textColor();
    const textSize: any = this.textSize();
    const formatDate = this.formatDateConvert();
    const { i18n } = this.props;
    return (
      <Label
        className={`label-text ${className}`}
        style={{
          color: textColor,
          ...style
        }}
        size={textSize}
      >
        {moment(notConvertToBE ? children : this.buddhistConvert())
          .locale(i18n.language)
          .format(formatDate)}
      </Label>
    );
  }

  private buddhistConvert() {
    const { children } = this.props;
    const year = parseInt(children.substring(0, 4)) + 543;
    const dateBuddhist = children.replace(
      children.substring(0, 4),
      year.toString()
    );
    return dateBuddhist;
  }

  private formatDateConvert() {
    const { formatDate } = this.props;
    let format = "Do MMM YY";
    switch (formatDate) {
      case "longDate":
        format = "Do MMMM YYYY";
        break;
      case "longDateTime":
        format = "lll";
        break;
      case "month":
        format = "MMMM";
        break;
      default:
        format = "Do MMM YY";
        break;
    }
    return format;
  }

  private textColor = () => {
    const { shade } = this.props;

    return getColor(shade);
  };
  private textSize = () => {
    const { size } = this.props;
    return size || "large";
  };
}
export default withTranslation()(DateText);
